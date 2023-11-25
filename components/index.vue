<template>
	<div class="container">
		<div class="page-header">
			<label class="page-title">{{ labelTranslation('Administration') | capitalize }}</label>&nbsp;
			<label class="page-subtitle">{{ labelTranslation($route.meta.labelTranslationKey) | capitalize }}</label>
			<div class="float-right">
				<router-view name="header"></router-view>
			</div>
		</div>
		<div class="page-body">
			<v-menu styleClass="page-menu">
				<v-menu-item v-if="canAccess('13-0')" path="/terminal-settings">{{ labelTranslation('Terminal settings') | capitalize }}</v-menu-item>
				<v-menu-item v-if="canAccess('15-0')" path="/day-schedules">{{ labelTranslation('Day schedules') | capitalize }}</v-menu-item>
			</v-menu>
			<div class="page-content">
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>

<script>
import './store'
import routes from './routes'
import { mapGetters, mapActions } from 'vuex'

export default {
	routes,
	computed: {
		...mapGetters('app', [
			'canAccess',
			'labelTranslation'
		])
	},
	methods: {
		...mapActions('admin', {
			getCountryList: 'getCountryList',
			getDepartments: 'getList',
			getTerminalListKeyValues: 'getTerminalListKeyValues'
		})
	},
	created () {
		this.getCountryList()
		this.getDepartments()
		this.getTerminalListKeyValues()
	}
}
</script>
