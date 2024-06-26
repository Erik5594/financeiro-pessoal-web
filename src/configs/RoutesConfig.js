import React from 'react'
import { AUTH_PREFIX_PATH, APP_PREFIX_PATH } from 'configs/AppConfig'

export const publicRoutes = [
    {
        key: 'login',
        path: `${AUTH_PREFIX_PATH}/login`,
        component: React.lazy(() => import('views/auth-views/authentication/login')),
    },
    {
        key: 'register',
        path: `${AUTH_PREFIX_PATH}/register`,
        component: React.lazy(() => import('views/auth-views/authentication/register')),
    },
    {
        key: 'forgot-password',
        path: `${AUTH_PREFIX_PATH}/forgot-password`,
        component: React.lazy(() => import('views/auth-views/authentication/forgot-password')),
    }
]

export const protectedRoutes = [
    {
        key: 'dashboard.default',
        path: `${APP_PREFIX_PATH}/dashboards/default`,
        component: React.lazy(() => import('views/app-views/dashboards')),
    },
    {
        key: 'categoria',
        path: `${APP_PREFIX_PATH}/categoria`,
        component: React.lazy(() => import('views/app-views/categoria/Categoria')),
    },
    {
        key: 'despesa',
        path: `${APP_PREFIX_PATH}/despesa`,
        component: React.lazy(() => import('views/app-views/despesa/Despesa')),
    },
    {
        key: 'metodos-pagamento',
        path: `${APP_PREFIX_PATH}/metodos-pagamento`,
        component: React.lazy(() => import('views/app-views/metodo-pagamento/MetodosPagamento')),
    },
    {
        key: 'configuracao',
        path: `${APP_PREFIX_PATH}/config/*`,
        component: React.lazy(() => import('views/app-views/configuracao/Configuracao')),
    }
]