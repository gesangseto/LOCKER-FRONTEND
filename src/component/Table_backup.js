import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Paginator } from 'primereact/paginator';
import React, { useEffect, useState } from 'react';
import { capitalize, isBoolean } from '../helper/utils';
import { useRouter } from 'next/router';
import ButtonLink from './ButtonLink';
import { getRoleMenu } from '../helper/storage';
import moment from 'moment/moment';

const Table = (props) => {
    const { data, keyId, field, filtering, enableUpdate = false, onClickUpdate, onClickCopy, onClickWorkflow, onClickRead, onClickDelete, onChangeFilter, ...rest } = props;
    const router = useRouter();
    const [tableData, setTableData] = useState([]);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [selectedDatas, setSelectedDatas] = useState(null);
    const [canRead, setCanRead] = useState(false);
    const [canUpdate, setCanUpdate] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const [canPrint, setCanPrint] = useState(false);
    const [canWorkflow, setCanWorkflow] = useState(false);
    const [filter, setFilter] = useState({
        first: 1,
        page: 1,
        limit: 10,
        totalData: 0,
        search: null
    });

    useEffect(() => {
        for (const it of getRoleMenu()) {
            if (it.url && router.asPath.includes(it.url)) {
                if (it.can_read && it.read) {
                    setCanRead(true);
                }
                if (it.can_update && it.update) {
                    setCanUpdate(true);
                }
                if (it.can_delete && it.delete) {
                    setCanDelete(true);
                }
                if (it.can_print && it.print) {
                    setCanPrint(true);
                }
                if (it.can_workflow && it.workflow) {
                    setCanWorkflow(true);
                }
            }
        }
    }, []);

    useEffect(() => {
        if (Array.isArray(data) && data.length > 0) {
            setTableData(data);
        } else if (typeof data === 'object') {
            if (data.hasOwnProperty('data')) {
                setTableData(data.data);
            }
            if (data.hasOwnProperty('grand_total')) {
                setFilter({ ...filter, totalData: data.grand_total });
            }
        }
    }, [data]);

    useEffect(() => {
        let fil = { ...filter, ...filtering };
        if (filtering.hasOwnProperty('total') && filtering.hasOwnProperty('grand_total')) {
            fil.totalPages = Math.ceil(filtering.grand_total / fil.limit) ?? 0;
            fil.totalData = filtering.grand_total || 0;
        }
        setFilter({ ...fil });
    }, [filtering]);

    const handleChangeFilter = (item) => {
        let first = item.page * item.rows + 1;
        let fltr = { ...filter, page: item.page + 1, limit: item.rows, first: first };
        setFilter(fltr);
        if (onChangeFilter) {
            onChangeFilter(fltr);
        }
    };

    const confirmDeleteProduct = (selectedData) => {
        setSelectedData(selectedData);
        setDeleteDialog(true);
    };

    const statusBodyTemplate = (rowData) => {
        let string = '';
        if (rowData.status == 1) {
            string = 'qualified';
        } else if (!rowData.is_final) {
            string = 'negotiation';
        } else {
            string = 'unqualified';
        }
        return <span className={`customer-badge status-${string}`}>{rowData.status_name}</span>;
    };

    const defaultBodyTemplate = (rowData, key) => {
        const format = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
        const isValidDateTime = moment(rowData[key.field], format).isValid();
        let val = rowData[key.field];
        if (isValidDateTime && (key.field.includes('date') || key.field.includes('created') || key.field.includes('updated'))) {
            val = moment(val).format('YYYY-MM-DD HH:mm:ss');
        }
        let isBool = isBoolean(rowData[key.field]) || false;
        let string = val == true ? 'qualified' : 'unqualified';
        return (
            <>
                {isBool ? (
                    <span className={`customer-badge status-${string}`} size="small">
                        {val.toString()}
                    </span>
                ) : (
                    <span>{val}</span>
                )}
            </>
        );
    };

    const handleClickDelete = () => {
        setDeleteDialog(false);
        if (onClickDelete) onClickDelete(selectedData);
    };

    const actionBodyTemplate = (rowData) => {
        let key = keyId || 'id';
        let haveWorkflow = false;
        let can_update = true;
        if (rowData.hasOwnProperty('have_workflow')) {
            if (rowData.have_workflow && !rowData.is_final) haveWorkflow = true;
        }
        if (rowData.hasOwnProperty('is_lock_data')) {
            if (rowData.is_lock_data) can_update = false;
        }
        if (enableUpdate) can_update = true;
        return (
            <>
                {canRead && (onClickRead ? <ButtonLink onClick={() => onClickRead(rowData)} type={'read'} /> : <ButtonLink href={`${router.asPath}read?id=${rowData[key]}`} type={'read'} />)}
                {canUpdate && can_update && (onClickUpdate ? <ButtonLink onClick={() => onClickUpdate(rowData)} type={'update'} /> : <ButtonLink href={`${router.asPath}update?id=${rowData[key]}`} type={'update'} />)}
                {canDelete && <ButtonLink type={'delete'} onClick={() => confirmDeleteProduct(rowData)} />}
                {canWorkflow && haveWorkflow && <ButtonLink href={`${router.asPath}workflow?id=${rowData[key]}`} type={'workflow'} />}
                {onClickCopy && <ButtonLink onClick={() => onClickCopy(rowData)} type={'copy'} />}
            </>
        );
    };

    const deleteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" size="small" className="p-button-text" onClick={() => setDeleteDialog(false)} />
            <Button label="Yes" icon="pi pi-check" size="small" className="p-button-text" onClick={() => handleClickDelete()} />
        </>
    );

    return (
        <div>
            <DataTable
                size="small"
                tableStyle={{ minWidth: '60rem' }}
                value={tableData}
                selection={selectedDatas}
                onSelectionChange={(e) => setSelectedDatas(e.value)}
                dataKey="id"
                className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                emptyMessage="No data found."
                responsiveLayout="scroll"
                stripedRows
                {...rest}
            >
                {field
                    ? field.map((it) => <Column field={it.key} key={it.key} header={it.label} body={it.key === 'status_name' ? statusBodyTemplate : defaultBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>)
                    : tableData.length > 0 && Object.keys(tableData[0]).map((key) => <Column field={key} key={key} header={capitalize(key)} headerStyle={{ minWidth: '5rem' }}></Column>)}
                <Column body={actionBodyTemplate} header="Action" headerStyle={{ minWidth: '12rem' }}></Column>
            </DataTable>
            <Paginator first={filter.first} rows={filter.limit} totalRecords={filter.totalData} rowsPerPageOptions={[10, 20, 30]} onPageChange={(item) => handleChangeFilter(item)} />

            <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDialogFooter} onHide={() => setDeleteDialog(false)}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {selectedData && (
                        <span>
                            Are you sure you want to delete <b>{selectedData.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
};

export default Table;
