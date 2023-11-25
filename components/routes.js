import defaultBeforeEnter from '@/router/defaultBeforeEnter'

let routes = [
	{
		path: 'terminal-settings',
		component: () => import('./terminalSettings'),
		meta: {
			labelTranslationKey: 'Terminal settings',
			canBeDefault: 'true',
			sysMenuItemPath: '70-13-0-0'
		}
	},
	{
		path: 'day-schedules',
		component: () => import('./daySchedules'),
		meta: {
			labelTranslationKey: 'Day schedules',
			canBeDefault: 'true',
			sysMenuItemPath: '70-15-0-0'
		}
	}
]

routes.push({
	path: '',
	beforeEnter: defaultBeforeEnter(routes, '/admin/')
})

export default routes
