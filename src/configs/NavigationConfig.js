import { DashboardOutlined, DollarOutlined } from '@ant-design/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig'


const dashBoardNavTree = [{
  key: 'dashboards',
  path: `${APP_PREFIX_PATH}/dashboards`,
  title: 'sidenav.dashboard',
  icon: DashboardOutlined,
  breadcrumb: false,
  isGroupTitle: true,
  submenu: [
    {
      key: 'dashboards-default',
      path: `${APP_PREFIX_PATH}/dashboards/default`,
      title: 'sidenav.dashboard.default',
      icon: DashboardOutlined,
      breadcrumb: false,
      submenu: []
    }
  ]
},
{
  key: 'despesas',
  path: `${APP_PREFIX_PATH}/despesa`,
  title: 'sidenav.despesa',
  icon: DollarOutlined,
  breadcrumb: false,
  isGroupTitle: true,
  submenu: [
    {
      key: 'listaDespesas',
      path: `${APP_PREFIX_PATH}/despesa`,
      title: 'sidenav.despesa.lista',
      icon: DollarOutlined,
      breadcrumb: false,
      submenu: []
    }
  ]
}]

const navigationConfig = [
  ...dashBoardNavTree
]

export default navigationConfig;
