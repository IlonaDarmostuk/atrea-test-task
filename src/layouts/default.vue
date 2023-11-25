<template>
	<div class="layout">
		<template v-if="isUnauthorizedView">
			<div id="header">
				<layout-header-unauth></layout-header-unauth>
			</div>
			<router-view />
		</template>
		<template v-else>
			<input class="q" type="checkbox" id="menu-toggle" />
			<label for="menu-toggle"></label>
			<div id="header">
				<layout-header></layout-header>
			</div>
			<div id="menu-wrapper">
				<menu></menu>
			</div>
			<div id="content-layout">
				<div id="maintenance-header" v-if="initialized && hasMaintenanceRights" style="height:35px">
					{{ labelTranslation('Maintenance mode') | capitalize }}
				</div>
				<div id="router-view" :style="`height:calc(100% - ${initialized && hasMaintenanceRights ? 35 : 0}px)`">
					<router-view v-if="initialized" />
				</div>
			</div>
		</template>
		<vue-progress-bar />
	</div>
</template>

<script>
import Menu from './components/Menu'
import LayoutHeader from './components/LayoutHeader'
import LayoutHeaderUnauth from './components/LayoutHeaderUnauth'
import { mapGetters } from 'vuex'

export default {
	props: {
		initialized: Boolean
	},
	components: {
		LayoutHeader,
		Menu,
		LayoutHeaderUnauth
	},
	computed: {
		...mapGetters('app', [
			'labelTranslation',
			'hasMaintenanceRights'
		]),
		isUnauthorizedView() {
			return !this.$auth.isAuthenticated() || this.$route.name === '404';
		}
	}
}
</script>

<style>
#menu-wrapper {
	background-color: #303E4C;
	width: 194px;
	height: 100%;
	position: fixed;
	z-index: 9998;
	left: -194px;
	top: 0;
	transition: all .3s ease-in-out;
}

input#menu-toggle {
	display: none;
}

input#menu-toggle + label {
	background-image: url('~assets/img/hamburger.svg');
	background-repeat: no-repeat;
	background-size: cover;
	width: 20px;
	height: 22px;
	position: fixed;
	left: 20px;
	top: 18px;
	margin: 0;
	cursor: pointer;
	z-index: 9999;
	transform: rotate(180deg);
  transition: all .3s ease-in-out;
}

input#menu-toggle:checked + label {
	background-image: url('~assets/img/arrow_left.svg');
	transform: rotate(0deg);
}

input#menu-toggle:checked ~ #content-layout {
	margin-left: 202px;
}

input#menu-toggle:checked ~ #header {
	padding-left: 194px;
}

input#menu-toggle:checked ~ #menu-wrapper {
	left: 0;
}

#header,
#content-layout {
	transition: all .3s ease-in-out;
}

.layout {
	height: 100%;
}

#content-layout {
	height: calc(100% - 58px);
    margin: -118px 9px 11px 9px;
	transition: all .3s ease-in-out;
}

#content-layout :before,
#content-layout :after,
#content-layout input,
#content-layout button {
	transition: none;
}

#maintenance-header {
	background-color: #d3e8f6;
	text-align: center;
	font-weight: 600;
	color: #586280;
	padding: 4px;
}

#router-view {
	background-color: #FFF;
	padding: 15px 25px 25px 25px;
	box-shadow: 0 0 2px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.24);
    border-radius: 2px;
}
</style>
