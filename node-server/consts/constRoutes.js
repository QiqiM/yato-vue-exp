const asyncRoutes = [
    {
        path: '/permission',
        alwaysShow: true,
        name: '权限管理',
        children: [
            {
                path: 'user',
                name: '用户管理',
            },
            {
                path: 'directive',
                hidden:true,
                name: 'DirectivePermission'
            },
            {
                path: 'role',
                name: '角色管理'
            }
        ]
    },
    {
        path: '/',
        name: '转让审核',
        children: [
            {
                path: '',
                name: '转让审核'
            }
        ]
    },
    {
        path: '/purchaselist',
        name: '求购审核',
        children: [
            {
                path: '',
                name: '求购审核',
            }
        ]
    },
    {
        path: '/trades',
        name: '转让列表',
        children: [
            {
                path: '',
                name: '转让列表',
            }
        ]
    },
    {
        path: '/notes',
        name: '商务合作',
        children: [
            {
                path: '',
                name: '商务合作',
            }
        ]
    },
];

const constantRoutes = [
    {
        path: '/redirect',
        hidden: true,
        children: [
            {
                path: '/redirect/:path*',
            }
        ]
    },
    {
        path: '/login',
        hidden: true
    },
    {
        path: '/auth-redirect',
        hidden: true
    },
    {
        path: '/404',
        hidden: true
    },
    {
        path: '/401',
        hidden: true
    },
    {
        path: '',
        component: 'layout/Layout',
        redirect: 'dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard'
            }
        ]
    },
    {
        path: '/documentation',
        component: 'layout/Layout',
        children: [
            {
                path: 'index',
                name: 'Documentation'
            }
        ]
    },
    {
        path: '/guide',
        component: 'layout/Layout',
        redirect: '/guide/index',
        children: [
            {
                path: 'index',
                name: 'Guide',
            }
        ]
    }
]

const roles_default = [
    {
        key: 'admin',
        name: 'admin',
        description: 'Super Administrator. Have access to view all pages.',
        routes: asyncRoutes
    }
]


module.exports = {
    asyncRoutes,
    roles_default,
    constantRoutes
}