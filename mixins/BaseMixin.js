import validate from '@/plugins/validate'
import { mapGetters } from 'vuex'

export default {
	constants: {
		entityName: '',
		defaultModel: {},
		// deprecated (to be removed)
		tableApiHelperPath: '',
		formApiHelperPath: '',
		formApiHelperPathArray: [],
		sysMenuItemPath: '',
		isEditOnly: false,
		addButtonLayoutStyle: {
			'float': 'left',
			'margin-right': '10px'
		},
		removeButtonLayoutStyle: {
			'float': 'left'
		},
		saveButtonLayoutStyle: {
			'float': 'right'
		},
		cancelButtonLayoutStyle: {
			'float': 'right',
			'margin-right': '10px'
		},
		// deprecated (to be removed)
		tableConfig () {
			return {
				selectedEntry: this.modelCopy,
				creationMode: this.creationMode,
				onSelect: this.rowSelected,
				keyFields: this.tableKeyFields,
				selectFirst: true,
				headerTemplate: (h, column) => {
					return <span>{ global.Vue.filter('capitalize')(this.modelTranslation(column.headerKey || column.key)) }</span>
				}
			}
		}
	},
	data () {
		return {
			vm: this,
			tableFilter: '',
			creationMode: false,
			model: this.defaultModel,
			modelCopy: this.defaultModel
		}
	},
	computed: {
		...mapGetters('app', [
			'labelTranslation',
			'messageTranslation',
			'apiMethod',
			'canWrite',
			'hasMaintenanceRights'
		]),
		// deprecated (to be removed)
		tableKeyFields: function () {
			let methodHelper = this.apiMethod(this.tableApiHelperPath)
			return methodHelper && methodHelper.Metadata ? methodHelper.Metadata.filter(i => i.AttributeName === 'KeyFieldAttribute').map(i => i.FieldName) : []
		},
		modelTranslation: function () {
			return key => '<' + key + '>'
		},
		modelsEqual: function () {
			return Object.is(this.modelCopy, this.model)
		},
		isChanged: function () {
			return !this.modelsEqual || this.creationMode
		},
		canAdd: function () {
			return !this.isEditOnly && this.canWrite(this.sysMenuItemPath)
		},
		canDelete: function () {
			return !this.isEditOnly && this.canWrite(this.sysMenuItemPath)
		},
		canEdit: function () {
			return this.canWrite(this.sysMenuItemPath)
		},
		userHasMaintenanceRights: function () {
			return this.hasMaintenanceRights
		}
	},
	methods: {
		get () {
			return Promise.resolve()
		},
		add () {
			return Promise.resolve()
		},
		delete () {
			return Promise.resolve()
		},
		save () {
			return Promise.resolve()
		},
		getModelTranslations () {
			return Promise.resolve()
		},
		getDetails (obj) {
			return Promise.resolve(obj)
		},
		addEvent () {
			this.creationMode = !this.creationMode
			this.model = this.getCopy(this.defaultModel)
			this.modelCopy = this.getCopy(this.defaultModel)
		},
		deleteEvent () {
			if (this.$refs.deleteConfirm) {
				this.$refs.deleteConfirm.show().then(confirmed => {
					if (confirmed) {
						this.delete(this.model).then(() => {
							this.selectFirst()
						})
					}
				})
			}
		},
		saveEvent () {
			if (this.errors.items.length > 0) {
				this.triggerEvent(document, 'showErrors')
				return
			}
			if (this.creationMode) {
				this.add(this.model).then(() => {
					this.creationMode = false
					var obj = this.tableEntries[this.tableEntries.length - 1]
					this.$refs.dataTable.select(obj)
					this.model = this.getCopy(obj)
					this.modelCopy = this.getCopy(obj)
				})
			} else {
				this.save(this.model).then(() => {
					this.modelCopy = this.getCopy(this.model)
				})
			}
			this.clearValidation()
		},
		cancelEvent () {
			if (this.creationMode) {
				this.selectFirst()
			} else {
				this.model = this.getCopy(this.modelCopy)
			}
			this.creationMode = false
			this.clearValidation()
		},
		getCopy (obj) {
			return obj ? JSON.parse(JSON.stringify(obj)) : {}
		},
		rowSelected (obj) {
			this.checkForUnsavedChanges(() => {
				this.getDetails(obj).then(detailedObj => {
					this.model = this.getCopy(detailedObj)
					this.modelCopy = this.getCopy(detailedObj)
				})
			})
		},
		selectFirst () {
			if (this.tableEntries && this.tableEntries[0]) {
				const obj = this.tableEntries[0]
				if (!obj || !this.$refs.dataTable) return
				this.$refs.dataTable.select(obj)
				const promise = this.getDetails(obj)
				if (promise) {
					promise.then(detailedObj => {
						this.model = this.getCopy(detailedObj)
						this.modelCopy = this.getCopy(detailedObj)
					})
				}
			}
		},
		triggerEvent (el, eventName, options) {
			let event
			if (window.CustomEvent) {
				event = new CustomEvent(eventName, options)
			} else {
				event = document.createEvent('CustomEvent')
				event.initCustomEvent(eventName, true, true, options)
			}
			el.dispatchEvent(event)
		},
		clearValidation () {
			this.triggerEvent(document, 'resetInputs')
		},
		runValidation () {
			this.vm.triggerEvent(document, 'forceValidate')
		},
		checkForUnsavedChanges (callback) {
			if (this.creationMode || !this.modelsEqual) {
				if (this.$refs.routeErrorModal) this.$refs.routeErrorModal.open()
			} else callback()
		},
		closeRouteErrorModal () {
			this.$refs.routeErrorModal.close()
		}
	},
	beforeRouteLeave (to, from, next) {
		this.checkForUnsavedChanges(next)
	},
	created () {
		this.getModelTranslations()
		this.get().then(() => {
			this.selectFirst()
		})
	}
}
