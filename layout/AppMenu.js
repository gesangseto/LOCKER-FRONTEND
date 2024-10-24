import getConfig from 'next/config';
import React, { useContext, useEffect, useState } from 'react';
import { getRoleMenu } from '../src/helper/storage';
import { treeify } from '../src/helper/utils';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [menu, setMenu] = useState([]);

    useEffect(() => {
        if (menu.length === 0) {
            generateMenu();
        }
    }, []);

    const generateMenu = () => {
        let menu = getRoleMenu();
        let newMenu = [];
        for (const it of menu) {
            let tempMenu = { id: it.id, parent_id: it.parent_id, label: it.name, icon: it.icon, menu_module_id: it.menu_module_id, menu_module_name: it.menu_module_name };
            if (it.url) {
                tempMenu.to = it.url;
            }
            newMenu.push(tempMenu);
        }
        newMenu = treeify(newMenu, 'id', 'parent_id', 'items');
        const groupedObjects = newMenu.reduce((result, obj) => {
            const key = obj.menu_module_name;
            if (!result[key]) {
                result[key] = { label: key, items: [] };
            }
            result[key].items.push(obj);
            return result;
        }, {});
        const groupedArray = Object.values(groupedObjects);
        setMenu(groupedArray);
    };

    const model = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Master',
            icon: 'pi pi-fw pi-briefcase',
            to: '/master',
            items: [
                {
                    label: 'Administrator',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'Department',
                            to: '/administrator/department'
                        },
                        {
                            label: 'Section',
                            // icon: 'pi pi-fw pi-sign-in',
                            to: '/administrator/section'
                        },
                        {
                            label: 'User',
                            // icon: 'pi pi-fw pi-sign-in',
                            to: '/administrator/user'
                        },
                        {
                            label: 'Role Section',
                            // icon: 'pi pi-fw pi-sign-in',
                            to: '/administrator/role-section'
                        }
                    ]
                },
                {
                    label: 'Master-Data',
                    icon: 'pi pi-fw pi-database',
                    items: [
                        {
                            label: 'Conversion Unit',
                            // icon: 'pi pi-fw pi-sign-in',
                            to: '/master-data/conversion-unit'
                        },
                        {
                            label: 'Product Category',
                            // icon: 'pi pi-fw pi-sign-in',
                            to: '/master-data/product-category'
                        },
                        {
                            label: 'Packaging',
                            // icon: 'pi pi-fw pi-sign-in',
                            to: '/master-data/packaging'
                        },
                        {
                            label: 'Product',
                            // icon: 'pi pi-fw pi-sign-in',
                            to: '/master-data/product'
                        }
                    ]
                }
            ]
        },
        {
            label: 'Warehouse',
            icon: 'pi pi-fw pi-briefcase',
            to: '/warehouse',
            items: [
                {
                    label: 'Master',
                    icon: 'pi pi-database',
                    items: [
                        {
                            label: 'Category',
                            // icon: 'pi pi-fw pi-sign-in',
                            to: '/warehouse/master/warehouse-category'
                        },
                        {
                            label: 'Building',
                            // icon: 'pi pi-fw pi-sign-in',
                            to: '/warehouse/master/building'
                        },
                        {
                            label: 'Area',
                            // icon: 'pi pi-fw pi-sign-in',
                            to: '/warehouse/master/area'
                        },
                        {
                            label: 'Aisle',
                            // icon: 'pi pi-fw pi-sign-in',
                            to: '/warehouse/master/aisle'
                        },
                        {
                            label: 'Rack',
                            // icon: 'pi pi-fw pi-sign-in',
                            to: '/warehouse/master/rack'
                        },
                        {
                            label: 'Shelf',
                            // icon: 'pi pi-fw pi-sign-in',
                            to: '/warehouse/master/shelf'
                        },
                        {
                            label: 'Bin',
                            // icon: 'pi pi-fw pi-sign-in',
                            to: '/warehouse/master/bin'
                        }
                    ]
                },
                {
                    label: 'Config',
                    icon: 'pi pi-cog',
                    items: [
                        {
                            label: 'Store Location',
                            // icon: 'pi pi-fw pi-sign-in',
                            to: '/warehouse/config/store-location'
                        },
                        {
                            label: 'Flow Transfer',
                            // icon: 'pi pi-fw pi-sign-in',
                            to: '/warehouse/config/flow-transfer'
                        },
                        {
                            label: 'Role Access Warehouse',
                            // icon: 'pi pi-fw pi-sign-in',
                            to: '/warehouse/config/role-access'
                        }
                    ]
                },
                {
                    label: 'Transaction',
                    icon: 'pi pi-sitemap',
                    items: [
                        {
                            label: 'Pre-Inbound',
                            // icon: 'pi pi-fw pi-sign-in',
                            to: '/warehouse/transaction/pre-inbound'
                        }
                    ]
                }
            ]
        },
        {
            label: 'System',
            icon: 'pi pi-fw pi-briefcase',
            to: '/system',
            items: [
                {
                    label: 'Config',
                    icon: 'pi pi-cog',
                    items: [
                        {
                            label: 'Application',
                            to: '/config/application'
                        },
                        {
                            label: 'Metadata',
                            to: '/config/metadata'
                        },
                        {
                            label: 'Workflow',
                            to: '/config/workflow'
                        }
                    ]
                }
            ]
        },
        {
            label: 'UI Components',
            items: [
                { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
                { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
                { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', to: '/uikit/floatlabel' },
                { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', to: '/uikit/invalidstate' },
                { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
                { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
                { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
                { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
                { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
                { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
                { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
                { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu', preventExact: true },
                { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
                { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
                { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
                { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc' }
            ]
        },
        {
            label: 'Prime Blocks',
            items: [
                { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', to: '/blocks', badge: 'NEW' },
                { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: 'https://www.primefaces.org/primeblocks-react', target: '_blank' }
            ]
        },
        {
            label: 'Utilities',
            items: [
                { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', to: '/utilities/icons' },
                { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: 'https://www.primefaces.org/primeflex/', target: '_blank' }
            ]
        },
        {
            label: 'Pages',
            icon: 'pi pi-fw pi-briefcase',
            to: '/pages',
            items: [
                {
                    label: 'Landing',
                    icon: 'pi pi-fw pi-globe',
                    to: '/landing'
                },
                {
                    label: 'Auth',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'Login',
                            icon: 'pi pi-fw pi-sign-in',
                            to: '/auth/login'
                        },
                        {
                            label: 'Error',
                            icon: 'pi pi-fw pi-times-circle',
                            to: '/auth/error'
                        },
                        {
                            label: 'Access Denied',
                            icon: 'pi pi-fw pi-lock',
                            to: '/auth/access'
                        }
                    ]
                },
                {
                    label: 'Crud',
                    icon: 'pi pi-fw pi-pencil',
                    to: '/pages/crud'
                },
                {
                    label: 'Timeline',
                    icon: 'pi pi-fw pi-calendar',
                    to: '/pages/timeline'
                },
                {
                    label: 'Not Found',
                    icon: 'pi pi-fw pi-exclamation-circle',
                    to: '/pages/notfound'
                },
                {
                    label: 'Empty',
                    icon: 'pi pi-fw pi-circle-off',
                    to: '/pages/empty'
                }
            ]
        },
        {
            label: 'Hierarchy',
            items: [
                {
                    label: 'Submenu 1',
                    icon: 'pi pi-fw pi-bookmark',
                    items: [
                        {
                            label: 'Submenu 1.1',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                            ]
                        },
                        {
                            label: 'Submenu 1.2',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                        }
                    ]
                },
                {
                    label: 'Submenu 2',
                    icon: 'pi pi-fw pi-bookmark',
                    items: [
                        {
                            label: 'Submenu 2.1',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                            ]
                        },
                        {
                            label: 'Submenu 2.2',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                        }
                    ]
                }
            ]
        },
        {
            label: 'Get Started',
            items: [
                {
                    label: 'Documentation',
                    icon: 'pi pi-fw pi-question',
                    to: '/documentation'
                },
                {
                    label: 'View Source',
                    icon: 'pi pi-fw pi-search',
                    url: 'https://github.com/primefaces/sakai-react',
                    target: '_blank'
                }
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {menu.length > 0 &&
                    menu.map((item, i) => {
                        return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={i} /> : <li className="menu-separator"></li>;
                    })}

                {/* <Link href="https://www.primefaces.org/primeblocks-react">
                    <a target="_blank" style={{ cursor: 'pointer' }}>
                        <img alt="Prime Blocks" className="w-full mt-3" src={`${contextPath}/layout/images/banner-primeblocks${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`} />
                    </a>
                </Link> */}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
