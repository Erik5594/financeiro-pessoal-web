import {
  BarChartOutlined,
  ExceptionOutlined,
  DollarOutlined,
  DeliveredProcedureOutlined,
  UserOutlined,
  LockOutlined,
  GoldOutlined,
  SettingOutlined,
  HistoryOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { APP_PREFIX_PATH } from "configs/AppConfig";

const dashBoardNavTree = [
  {
    key: "dashboards",
    title: "home",
    path: `${APP_PREFIX_PATH}/dashboards/default`,
    icon: BarChartOutlined,
    breadcrumb: false,
    isGroupTitle: false,
    submenu: [],
  },
  {
    key: "cadastros",
    title: "sidenav.cadastro",
    icon: DeliveredProcedureOutlined,
    breadcrumb: true,
    isGroupTitle: true,
    submenu: [
      {
        key: "listaDespesas",
        path: `${APP_PREFIX_PATH}/despesa`,
        title: "sidenav.despesa.lista",
        icon: ExceptionOutlined,
        breadcrumb: false,
        submenu: [],
      },
      {
        key: "listaCatgoria",
        path: `${APP_PREFIX_PATH}/categoria`,
        title: "sidenav.categoria.lista",
        icon: GoldOutlined,
        breadcrumb: false,
        submenu: [],
      },
      {
        key: "metodosPagamento",
        title: "sidenav.config.metodos-pagamento",
        path: `${APP_PREFIX_PATH}/metodos-pagamento`,
        icon: DollarOutlined,
        breadcrumb: false,
        submenu: [],
      },
    ],
  },
  {
    key: "configuracao",
    title: "sidenav.config",
    icon: SettingOutlined,
    breadcrumb: false,
    isGroupTitle: true,
    submenu: [
      {
        key: "perfil",
        path: `${APP_PREFIX_PATH}/config/editar-perfil`,
        title: "sidenav.config.perfil",
        icon: UserOutlined,
        breadcrumb: false,
        submenu: [],
      },
      {
        key: "planos",
        path: `${APP_PREFIX_PATH}/config/planos`,
        title: "sidenav.config.plano",
        icon: ShoppingCartOutlined,
        breadcrumb: false,
        submenu: [],
      },
      {
        key: "mensalidades",
        path: `${APP_PREFIX_PATH}/config/mensalidade`,
        title: "sidenav.config.mensalidade",
        icon: HistoryOutlined,
        breadcrumb: false,
        submenu: [],
      },
      {
        key: "settings",
        path: `${APP_PREFIX_PATH}/config/settings`,
        title: "sidenav.config.settings",
        icon: SettingOutlined,
        breadcrumb: false,
        submenu: [],
      },
      {
        key: "alterar-senha",
        path: `${APP_PREFIX_PATH}/config/alterar-senha`,
        title: "sidenav.config.alterar-senha",
        icon: LockOutlined,
        breadcrumb: false,
        submenu: [],
      },
    ],
  },
];

const navigationConfig = [...dashBoardNavTree];

export default navigationConfig;
