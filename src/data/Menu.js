const sidebarMenu = [
	//菜谱
	{
		key: 'course',
		link: '/',
		name: '问卷管理',
		icon: 'solution',
		sub: [
			{
				key: 'list',
				link: '/cookbook/list',
				name: '所有问卷'
			},
			{
				key: 'category',
				link: '/cookbook/category',
				name: '推荐问卷'
			},
		]
	},
	//食材
	{
		key: 'material',
		link: '/',
		name: '用户管理',
		icon: 'solution',
		sub: [
			{
				key: 'materials',
				link: '/material',
				name: '所有用户'
			},
		]
	},
]

export { sidebarMenu }