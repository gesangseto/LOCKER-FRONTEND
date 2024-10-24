import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import { capitalize, isBoolean } from '../helper/utils';
import { Calendar } from 'primereact/calendar';
import moment from 'moment/moment';

const TrxDetailTabel = (props) => {
    const { data, field, onClickUpdate, useHeader = true, useAction = true, onClickWorkflow, onClickRead, onClickDelete, ...rest } = props;
    const [tableData, setTableData] = useState([]);
    const [selectedDatas, setSelectedDatas] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [totalData, setTotalData] = useState({ total_quantity_lvl_1: 0, total_conversion_text: '', total_conversion: [] });

    useEffect(() => {
        initFilters();
    }, []);

    // const mappedData = data.map((item, index) => {
    //     const key = Object.keys(item)[0]; // Mengambil kunci pertama dari objek
    //     return { key, ...item }; // Menggabungkan kunci dengan objek
    // });

    useEffect(() => {
        if (Array.isArray(data) && data.length > 0) {
            const mappedData = data.map((item, index) => {
                Object.keys(item).map((key) => (key.includes('date') ? (item[key] = new Date(item[key])) : (item[key] = item[key])));
                return item;
            });
            setTableData(mappedData);
            setFilteredData(mappedData);
        } else if (typeof data === 'object') {
            if (data.hasOwnProperty('data')) {
                setTableData(data.data);
                setFilteredData(data.data);
            }
        }
    }, [data]);

    useEffect(() => {
        let total = JSON.parse(JSON.stringify(totalData));
        total.total_quantity_lvl_1 = 0;
        total.total_conversion_text = '';
        total.total_conversion = [];
        let conversion = {};
        for (const it of filteredData) {
            if (it) {
                if (it.hasOwnProperty('conversion'))
                    for (const conv of it.conversion) {
                        if (conv.conversion_unit_code) {
                            if (!conversion[conv.conversion_unit_code]) {
                                conversion[conv.conversion_unit_code] = [];
                                conversion[conv.conversion_unit_code].push(conv.conversion_quantity);
                            } else {
                                conversion[conv.conversion_unit_code].push(conv.conversion_quantity);
                            }
                        } else if (conv.conversion_code) {
                            if (!conversion[conv.conversion_code]) {
                                conversion[conv.conversion_code] = [];
                                conversion[conv.conversion_code].push(conv.conversion_quantity);
                            } else {
                                conversion[conv.conversion_code].push(conv.conversion_quantity);
                            }
                        }
                    }
                total.total_quantity_lvl_1 += parseInt(it.quantity);
            }
        }

        for (const key in conversion) {
            let i = 0;
            for (const it of conversion[key]) {
                i += parseFloat(it);
            }
            total.total_conversion.push({ code: key, total: parseFloat(i).toFixed(2) });
            total.total_conversion_text += `${parseFloat(i).toFixed(2)} ${key}, `;
        }
        setTotalData(total);
    }, [filteredData]);

    const dateBodyTemplate = (rowData, key) => {
        let value = rowData[key];
        return moment(value).format('YYYY-MM-DD');
    };

    const defaultBodyTemplate = (rowData, key) => {
        let val = rowData[key.field];
        return <small>{val}</small>;
    };

    const handleClickWorkflow = (item) => {
        if (onClickWorkflow) onClickWorkflow(item);
    };

    const actionBodyTemplate = (rowData) => {
        let haveChild = true;
        if (rowData.packaging_level == 1) {
            haveChild = false;
        }
        return <>{haveChild && <Button size="small" icon="pi pi-eye" className="p-button-rounded p-button-info " onClick={() => handleClickWorkflow(rowData)} />}</>;
    };

    const initFilters = () => {
        let keys = {};
        for (const it of field) {
            keys[it.key] = {};
        }
        for (const key in keys) {
            if (key.includes('date')) {
                keys[key] = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] };
            } else {
                keys[key] = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] };
            }
        }
        keys.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
        setFilters(keys);
        setGlobalFilterValue('');
        // setFilters({
        //     global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        //     name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        //     'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        //     representative: { value: null, matchMode: FilterMatchMode.IN },
        //     date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        //     balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        //     status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        //     activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
        //     verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        // });
    };
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" size="small" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={initFilters} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };
    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="yyyy-mm-dd" placeholder="yyyy-mm-dd" mask="9999/99/99" />;
    };

    return (
        <div>
            <Divider />
            <div className="flex justify-content-between ">
                <h5>{useHeader && 'Items'}</h5>
                <span>
                    <div className="flex justify-content-between">
                        <p className="text-left">
                            <strong>Total Quantity:&nbsp;</strong>
                            <br />
                            <strong>Total Conversion:&nbsp;</strong>
                        </p>
                        <p className="text-right">
                            {totalData.total_quantity_lvl_1}
                            <br />
                            {totalData.total_conversion.map((item) => `${item.code} [${item.total}]`).join(', ')}
                        </p>
                    </div>
                </span>
            </div>
            <DataTable
                header={renderHeader}
                size="small"
                tableStyle={{ minWidth: '60rem' }}
                value={tableData}
                onSelectionChange={(e) => setSelectedDatas(e.value)}
                dataKey="id"
                className="datatable-responsive mb-5"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                emptyMessage="No workflow found."
                responsiveLayout="scroll"
                onValueChange={(datas) => setFilteredData(datas)}
                filters={filters}
                // filterDisplay={(e) => console.log(e, 'display')}
                {...rest}
            >
                {field
                    ? field.map((it) => {
                          let isDate = false;
                          if (it.key.includes('date')) isDate = true;
                          if (isDate) {
                              return (
                                  <Column
                                      filter
                                      filterPlaceholder="Search"
                                      field={it.key}
                                      key={it.key}
                                      header={it.label}
                                      sortable
                                      body={(row) => dateBodyTemplate(row, it.key)}
                                      headerStyle={{ minWidth: '5rem' }}
                                      //   filterField={it.key}
                                      dataType="date"
                                      filterElement={dateFilterTemplate}
                                      //
                                  />
                              );
                          } else {
                              return (
                                  <Column
                                      filter
                                      filterPlaceholder="Search"
                                      field={it.key}
                                      key={it.key}
                                      header={it.label}
                                      sortable
                                      body={defaultBodyTemplate}
                                      headerStyle={{ minWidth: '5rem' }}
                                      //
                                  />
                              );
                          }
                      })
                    : tableData.length > 0 && Object.keys(tableData[0]).map((key) => <Column field={key} key={key} header={capitalize(key)} headerStyle={{ minWidth: '5rem' }}></Column>)}
                {useAction && <Column body={actionBodyTemplate} header="Action" headerStyle={{ minWidth: '5rem' }}></Column>}
            </DataTable>
        </div>
    );
};

export default TrxDetailTabel;
