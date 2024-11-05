import { useRouter } from 'next/router';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import TextInput from 'src/component/TextInput';
import { useToast } from 'src/component/ToastProvider';
import { error } from 'src/constant/message';
import { capitalize } from 'src/helper/utils';
import { getConfAccessMenu, updateConfAccessMenu } from 'src/service/config/access-menu';
import FooterTemplate from '../../../src/component/FooterTemplate';

const Index = () => {
    const showToast = useToast();
    const router = useRouter();
    const { action, id } = router.query;
    const [initialLoad, setInitialLoad] = useState(true);
    const [listModule, setListModule] = useState([]);
    const [formData, setFormData] = useState({ section_name: '', section_code: '', department_name: '', department_code: '', access_menu: [], status: 1 });

    useEffect(() => {
        validation();
    }, [formData]);

    useEffect(() => {
        if (id) getData(id);
    }, [action, id]);

    const getData = async (id) => {
        let res = await getConfAccessMenu({ id: id });
        if (res && res.data) {
            if (res.data[0]) {
                let uniqueMenuModuleIds = new Set(); // Set kosong untuk menyimpan unique menu_module_id
                let unik = [];
                res.data[0].access_menu.forEach((item) => {
                    if (!uniqueMenuModuleIds.has(item.menu_module_id)) {
                        uniqueMenuModuleIds.add(item.menu_module_id);
                        unik.push(item);
                    }
                });
                let map = mappingToTreeFormat(res.data[0].access_menu);
                setListModule(unik);
                setFormData({ ...res.data[0] });
            }
        }
    };

    const mappingToTreeFormat = (data) => {
        let temps = [];
        for (const it of data) {
            let temp = { key: it.id, children: [], data: {} };
            if (it.children) {
                temp.children = mappingToTreeFormat(it.children);
            }
            delete it.children;
            temp.data = { ...it };
            temps.push(temp);
        }
        return temps;
    };

    const validation = (force) => {
        if (initialLoad && !force) return true;
        if (!formData.code) return false;
        else if (!formData.name) return false;
        return true;
    };

    const save = async () => {
        setInitialLoad(false);
        if (!validation(true)) {
            return showToast(error.required);
        }
        let send = await updateConfAccessMenu(formData);

        if (send.error) {
            showToast({ type: 'error', message: send.message });
        } else {
            showToast({ type: 'success', message: 'Data saved' });
            router.back();
        }
    };
    const chekboxTemplate = (rowData, type) => {
        console.log(rowData[type]);

        return <React.Fragment>{(rowData[`can_${type}`] || type === 'all') && <Checkbox checked={rowData[type] ? true : false} onChange={(e) => changeChecked(e.checked, rowData, type)} className="mr-2"></Checkbox>} </React.Fragment>;
    };

    const changeChecked = (checked, data, type) => {
        let temp_role = [...formData.access_menu];
        let idx = temp_role.findIndex((item) => item.id === data.id);
        if (~idx) {
            if (type === 'all') {
                temp_role[idx].create = checked;
                temp_role[idx].read = checked;
                temp_role[idx].update = checked;
                temp_role[idx].delete = checked;
                temp_role[idx].print = checked;
                temp_role[idx].all = checked;
            } else {
                temp_role[idx][type] = checked;
                temp_role[idx].all = !checked ? false : temp_role[idx].all;
            }
            setFormData({ ...formData, access_menu: temp_role });
        }
    };

    return (
        <div className="card">
            <h5>{capitalize(action)} Access-Menu</h5>
            <div className="grid p-fluid mt-5">
                <div className="field col-12 md:col-6">
                    <TextInput title="Department Code" value={formData.department_code} disabled />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Department Name" value={formData.department_name} disabled />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Section Code" value={formData.section_code} disabled />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Section Name" value={formData.section_name} disabled />
                </div>
            </div>
            <Accordion activeIndex={formData.access_menu.length > 0 ? 0 : null} multiple className="mb-5">
                {listModule.map((item, index) => {
                    let module_menu = formData.access_menu.filter((it) => it.menu_module_id === item.menu_module_id);
                    // Mencari nama parent_menu untuk setiap objek
                    for (const obj of module_menu) {
                        const parentId = obj.parent_id;
                        if (parentId !== null) {
                            const parentObj = module_menu.find((item) => item.id === parentId);
                            if (parentObj !== undefined) {
                                obj.parent_menu = parentObj.name;
                            }
                        }
                    }
                    module_menu = module_menu.filter((it) => it.url);

                    return (
                        <AccordionTab header={item.menu_module_name} key={index}>
                            <DataTable selectionMode={'checkbox'} dataKey="id" value={module_menu} rowGroupMode="rowspan" groupRowsBy="parent_menu" sortMode="single" sortField="parent_menu" sortOrder={1} tableStyle={{ minWidth: '50rem' }}>
                                <Column field="parent_menu" header="Parent" style={{ minWidth: '100px' }}></Column>
                                <Column field="name" header="Name" style={{ minWidth: '100px' }}></Column>
                                <Column field="create" header="Create" style={{ minWidth: '100px' }} body={(aisle) => chekboxTemplate(aisle, 'create')}></Column>
                                <Column field="read" header="Read" style={{ minWidth: '100px' }} body={(aisle) => chekboxTemplate(aisle, 'read')}></Column>
                                <Column field="update" header="Update" style={{ minWidth: '100px' }} body={(aisle) => chekboxTemplate(aisle, 'update')}></Column>
                                <Column field="delete" header="Delete" style={{ minWidth: '100px' }} body={(aisle) => chekboxTemplate(aisle, 'delete')}></Column>
                                <Column field="print" header="Print" style={{ minWidth: '100px' }} body={(aisle) => chekboxTemplate(aisle, 'print')}></Column>
                                <Column field="workflow" header="Workflow" style={{ minWidth: '100px' }} body={(aisle) => chekboxTemplate(aisle, 'workflow')}></Column>
                                <Column field="all" header="Checked In Line" style={{ minWidth: '100px' }} body={(aisle) => chekboxTemplate(aisle, 'all')}></Column>
                            </DataTable>
                        </AccordionTab>
                    );
                })}
            </Accordion>
            <FooterTemplate onClickSave={() => save()} onClickBack={() => router.back()} data={formData} onChangeMetadata={(item) => setFormData({ ...formData, metadata: item })} />
        </div>
    );
};

export default Index;
