import moment from 'moment';
import { useRouter } from 'next/router';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import React, { useEffect, useState } from 'react';
import { getRoleMenu } from '../helper/storage';
import { capitalize, isBoolean } from '../helper/utils';
import ButtonLink from './ButtonLink';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';

export default function Table(props) {
    const { data, keyId, field, filtering, enableUpdate = false, onClickUpdate, onClickCopy, onClickWorkflow, onClickRead, onClickDelete, onChangeFilter, ...rest } = props;
    const router = useRouter();

    const [initialLoad, setInitialLoad] = useState(true);
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
        search: '',
        search_options: null
    });

    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    // EFFECT
    useEffect(() => {
        if (initialLoad) initFilters();
        if (Array.isArray(data) && data.length > 0) {
            setInitialLoad(false);
            setTableData(data);
        } else if (typeof data === 'object') {
            setInitialLoad(false);
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

    useEffect(() => {
        // Load role
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

    // FUNCTION
    const confirmDeleteProduct = (selectedData) => {
        setSelectedData(selectedData);
        setDeleteDialog(true);
    };
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filter = { ...filter, search: value ? value : '' };
        setFilter(_filter);
    };
    const initFilters = () => {
        let reformatFilter = {};
        for (const fil of field) {
            if (fil.key.includes('date') || fil.key.includes('created') || fil.key.includes('updated')) {
                reformatFilter[fil.key] = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] };
            } else if (fil.key == 'id' || fil.key.endsWith('_id')) {
                reformatFilter[fil.key] = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] };
            } else if (fil.type && fil.type == 'boolean') {
                reformatFilter[fil.key] = { value: null, matchMode: FilterMatchMode.EQUALS };
            } else {
                reformatFilter[fil.key] = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] };
            }
        }
        setFilters(reformatFilter);
        let _filter = { ...filter, search: '', search_options: reformatFilter };
        setFilter({ ..._filter });
        return _filter;
        // setFilters({
        //     global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        //     id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        //     'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        //     representative: { value: null, matchMode: FilterMatchMode.IN },
        //     date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        //     created_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        //     balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        //     status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        //     activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
        //     verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        // });
    };

    // HANDLING FUNCTION
    const handleClickDelete = () => {
        setDeleteDialog(false);
        if (onClickDelete) onClickDelete(selectedData);
    };

    const clearFilter = () => {
        let _resetFilter = initFilters();
        handleChangeFilter(_resetFilter);
    };
    const handleCommitSearch = (e) => {
        if (e.key == 'Enter' && e.keyCode === 13) {
            handleChangeFilter({ search: filter.search });
        }
    };
    const handleChangePagination = (e) => {
        let first = e.page * e.rows + 1;
        let _filter = { page: e.page + 1, limit: e.rows, first: first };
        if (_filter.page != filter.page || _filter.limit != filter.limit) handleChangeFilter({ pagination: _filter });
    };

    const handleChangeFilter = (props) => {
        const { pagination, search, search_options } = props;
        let _filter = { ...filter };
        if (search_options) _filter.search_options = JSON.stringify(search_options);
        if (search || search === '') _filter.search = search;
        if (pagination) {
            _filter.first = pagination.first;
            _filter.page = pagination.page;
            _filter.limit = pagination.limit;
        }
        setFilter(_filter);
        if (onChangeFilter) onChangeFilter(_filter);
    };

    // RENDER TEMPLATES

    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };
    const numericFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} />;
    };
    const booleanFilterTempalte = (options) => {
        return (
            <div className="flex align-items-center gap-2">
                <TriStateCheckbox value={options.value} onChange={(e) => options.filterCallback(e.value)} />
            </div>
        );
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

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={filter.search} onChange={onGlobalFilterChange} onKeyDown={(e) => handleCommitSearch(e)} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const defaultBodyTemplate = (rowData, key) => {
        let val = rowData[key.field];
        let isBool = isBoolean(rowData[key.field]) || false;
        return <>{isBool ? <i className={classNames('pi', { 'text-green-500 pi-check-circle': val, 'text-red-500 pi-times-circle': !val })}></i> : <span>{val}</span>}</>;
    };
    const dateBodyTemplate = (rowData, key) => {
        const format = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
        const isValidDateTime = moment(rowData[key.field], format).isValid();
        let val = rowData[key.field];
        return new Date(val).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        // if (isValidDateTime) {
        //     val = moment(val).format('YYYY-MM-DD');
        // }
        // return val;
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

    const deleteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" size="small" className="p-button-text" onClick={() => setDeleteDialog(false)} />
            <Button label="Yes" icon="pi pi-check" size="small" className="p-button-text" onClick={() => handleClickDelete()} />
        </>
    );
    const header = renderHeader();

    return (
        <div>
            <DataTable
                size="small"
                value={tableData}
                selection={selectedDatas}
                onSelectionChange={(e) => setSelectedDatas(e.value)}
                dataKey="id"
                // className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                emptyMessage="No data found."
                loading={loading}
                filters={filters}
                header={header}
                autoLayout={true}
                onFilter={(e) => handleChangeFilter({ search_options: e })}
                {...rest}
            >
                {field
                    ? field.map((it) => {
                          let typeData = 'text';
                          let useFilter = true;
                          if (it.hasOwnProperty('filter')) {
                              useFilter = it.filter;
                          }
                          if (it.key.includes('date') || it.key.includes('created') || it.key.includes('updated')) {
                              typeData = 'date';
                          } else if (it.key == 'id' || it.key.endsWith('_id')) {
                              typeData = 'numeric';
                          }
                          if (it.type) {
                              typeData = it.type;
                          }
                          return (
                              <Column
                                  size="small"
                                  field={it.key}
                                  key={it.key}
                                  header={it.label}
                                  dataType={typeData}
                                  style={{ flexGrow: 1, position: 'sticky' }}
                                  body={typeData == 'date' ? dateBodyTemplate : defaultBodyTemplate}
                                  headerStyle={{ minWidth: '5rem' }}
                                  filter={useFilter}
                                  autoLayout={true}
                                  //   sortable
                                  filterElement={typeData == 'date' ? dateFilterTemplate : typeData == 'numeric' ? numericFilterTemplate : typeData == 'boolean' ? booleanFilterTempalte : null}
                                  filterPlaceholder={`Search by ${it.label}`}
                              />
                          );
                      })
                    : tableData.length > 0 && Object.keys(tableData[0]).map((key) => <Column field={key} key={key} header={capitalize(key)} headerStyle={{ minWidth: '5rem' }}></Column>)}

                <Column body={actionBodyTemplate} header="Action" headerStyle={{ minWidth: '11rem' }}></Column>
            </DataTable>
            <Paginator first={filter.first} rows={filter.limit} totalRecords={filter.totalData} rowsPerPageOptions={[10, 20, 30]} onPageChange={(item) => handleChangePagination(item)} />

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
}
