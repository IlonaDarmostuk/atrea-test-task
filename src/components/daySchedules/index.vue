<template>
	<sys-base :vm="vm">
		<div slot="sys-table" class="sys-table">
			<v-data-table ref="dataTable" :columns="tableColumns" :entries="tableEntries" :filter="tableFilter"
				:creationMode="creationMode" :keyField="tableKeyFields" @select="rowSelected" :preventRowSelection="!modelsEqual">
				<template slot="column::Id">{{ modelTranslation('Id') | capitalize }}</template>
				<template slot="column::Name">{{ modelTranslation('Name') | capitalize }}</template>
				<template slot="cell::Id" slot-scope="{ props }"><span class="font-bold">{{ props.Id }}</span></template>
			</v-data-table>
		</div>
		<div slot="sys-details" class="day-schedules">
			<v-tab-view :withInit="true" :tabs="tabs" :vm="this" style="margin-left:20px">
				<template slot="label-template" slot-scope="{ tab }">{{ labelTranslation(tab.labelKey) | capitalize }}</template>
			</v-tab-view>
		</div>
		<template slot="sys-buttons">
			<button @click="addEvent" v-if="canAdd" v-show="!isChanged" :style="addButtonLayoutStyle" class="button secondary add">{{ labelTranslation("Add new") | capitalize }}</button>
			<button @click="copySelected" v-if="canAdd" v-show="!isChanged" :style="addButtonLayoutStyle" class="button default">{{ labelTranslation("Copy") | capitalize }}</button>
			<button @click="deleteEvent" v-if="canDelete" v-show="!isChanged" :style="removeButtonLayoutStyle" class="button danger-outline delete">{{ labelTranslation("Delete") | capitalize }}</button>
			<button @click="saveEvent" v-if="canEdit" v-show="isChanged" :style="saveButtonLayoutStyle" class="button primary">{{ labelTranslation("Save") | capitalize }}</button>
			<button @click="cancelEvent" v-if="canEdit" v-show="isChanged" :style="cancelButtonLayoutStyle" class="button default">{{ labelTranslation("Cancel") | capitalize }}</button>
		</template>
		<div slot="modal-block">
			<VModal ref="errorDeleteModal" :width="'500px'" :backdrop='false'>
				<template slot="header">
					{{this.labelTranslation('This dayschedule can not be deleted') | capitalize}}
				</template>
				<template slot="body">
					<div class="center-content nowrap-for-modal">
						<p>{{ messageTranslation('This item cannot be deleted because it is already used somewhere else')}}</p>
						<button class="button default okBtn" @click="closeDeleteModal">{{ messageTranslation('Ok') | capitalize }}</button>
					</div>
				</template>
			</VModal>
			<VModal :width="'500px'" :backdrop='false' :show='validationMessage !== null'>
				<template slot="header">
					{{this.labelTranslation('This dayschedule can not be saved') | capitalize}}
				</template>
				<template slot="body">
					<div class="center-content nowrap-for-modal">
						<p>{{ validationMessage }}</p>
						<button class="button default okBtn" @click="closeErrorModal">{{ messageTranslation('Ok') | capitalize }}</button>
					</div>
				</template>
			</VModal>
		</div>
	</sys-base>
</template>

<script>
/* global valueEquals */
import '@/store/store'
import store from '@/store'
import SysBase from '../../SysBase'
import SysMixin from '../../SysMixin'
import { mapActions, mapGetters, mapState } from 'vuex'
import { sysDaySchedule, sysDayScheduleRounding, sysDayScheduleBreak, sysDayScheduleEscapeSchedule } from '@/app/api'
import VModal from '@/app/shared/components/VModal'
import Overview from './tabComponents/Overview'
import Breaks from './tabComponents/Breaks'
import Switches from './tabComponents/Switches'
import Overtime from './tabComponents/Overtime'
import CalculationRules from './tabComponents/CalculationRules'
import BookingRoundings from './tabComponents/BookingRoundings'
import OtherSettings from './tabComponents/OtherSettings'

export default {
	mixins: [
		SysMixin
	],
	components: {
		SysBase,
		VModal
	},
	constants: {
		entityName: 'Day schedules',
		tableApiHelperPath: sysDaySchedule.add,
		formApiHelperPathArray: [sysDaySchedule.add, sysDayScheduleRounding.add, sysDayScheduleBreak.add, sysDayScheduleEscapeSchedule.add],
		sysMenuItemPath: '5',
		tabs: [
			{ path: '#overview', labelKey: 'Overview', component: Overview },
			{ path: '#breaks', labelKey: 'Breaks', component: Breaks },
			{ path: '#switches', labelKey: 'Switches', component: Switches },
			{ path: '#overtime', labelKey: 'Overtime', component: Overtime },
			{ path: '#calculation-rules', labelKey: 'Calculation rules', component: CalculationRules },
			{ path: '#booking-roundings', labelKey: 'Booking roundings', component: BookingRoundings },
			{ path: '#other-settings', labelKey: 'Other settings', component: OtherSettings }
		],
		defaultModel: {
			Id: '',
			CustomerId: store.getters['app/currentUser'].CustomerId,
			SysDayScheduleBreak: [],
			SysDayScheduleRelativeBreak: [],
			SysDayScheduleRounding: {
				EnumRoundingOfBookingSettingId: 1,
				EnumRoundingOfProjectBookingSettingId: 1,
				EntryBookingRoundTo: '00:00',
				EntryBookingUpFrom: '00:00',
				ExitBookingRoundTo: '00:00',
				ExitBookingUpFrom: '00:00'
			},
			SysDayScheduleEscapeSchedule1: [],
			SysDayScheduleNormboundOvertime: [],
			SysDayScheduleCalculation: {
				Type0: [],
				Type1: [],
				Type2: []
			},
			BussinessTripStartAt: '00:00',
			BussinessTripStopAt: '00:00',
			CorrectionNormHours: '00:00',
			ForgottenExitAt: '00:00',
			AbsenceStartAt: '00:00',
			AbsenceStopAt: '00:00',
			Description: '',
			NormHours: '00:00',
			DayStartAt: '00:00',
			DayStopAt: '00:00',
			AccessStartAt: '00:00',
			AccessStopAt: '00:00',
			OvertimeStartAt: '00:00',
			OvertimeStopAt: '00:00',
			StartAt: '00:00',
			StopAt: '00:00',
			BlockTimeStartAt: '00:00',
			BlockTimeStopAt: '00:00',
			EnumBreakCategoryTypeId: '1',
			EnumBreakTypeId: '0'
		}
	},
	data () {
		return {
			dayScheduleValidationState: {},
			breakValidationState: {},
			relativeBreakValidationState: {},
			switchValidationState: {},
			overtimeValidationState: {},
			bookingRoundingsValidationState: {},
			daySchedulePromise: {},
			breakPromise: {},
			bookingRoundingsPromise: {},
			switchPromise: {},
			overtimePromise: {},
			tableColumns: [
				{
					key: 'Id',
					width: '22%'
				},
				'Name'
			]
		}
	},
	computed: {
		...mapGetters('app', [
			'currentUser'
		]),
		...mapState('sysadmin/sysDaySchedule', {
			details: 'detailsDaySchedule'
		}),
		...mapGetters('sysadmin/sysDaySchedule', {
			tableData: 'dayScheduleList',
			enableRules: 'getEnableRules',
			dayTypeKeyValue: 'dayTypeKeyValue',
			modelTranslation: 'modelTranslation',
			counterKeyValues: 'counterKeyValues',
			validationMessage: 'validationMessage',
			breakTypeKeyValues: 'breakTypeKeyValues',
			dayScheduleKeyValues: 'dayScheduleKeyValues',
			overtimeTypeKeyValues: 'overtimeTypeKeyValues',
			allowanceMatrixKeyValues: 'allowanceMatrixKeyValues',
			breakTypeCategoryKeyValues: 'breakTypeCategoryKeyValues',
			roundingOfBookingKeyValues: 'roundingOfBookingKeyValues',
			relativeBreakSettingKeyValues: 'relativeBreakSettingKeyValues',
			roundingOfProjectBookingKeyValues: 'roundingOfProjectBookingKeyValues',
			normboundOvertimeSettingKeyValues: 'normboundOvertimeSettingKeyValues'
		}),
		modelsEqual: function () {
			return valueEquals(this.model.Id, this.modelCopy.Id) &&
				valueEquals(this.model.Description, this.modelCopy.Description) &&
				valueEquals(this.model.NormHours, this.modelCopy.NormHours) &&
				valueEquals(this.model.DayStartAt, this.modelCopy.DayStartAt) &&
				valueEquals(this.model.DayStopAt, this.modelCopy.DayStopAt) &&
				valueEquals(this.model.AccessStartAt, this.modelCopy.AccessStartAt) &&
				valueEquals(this.model.AccessStopAt, this.modelCopy.AccessStopAt) &&
				valueEquals(this.model.OvertimeStartAt, this.modelCopy.OvertimeStartAt) &&
				valueEquals(this.model.OvertimeStopAt, this.modelCopy.OvertimeStopAt) &&
				valueEquals(this.model.BlockTimeStartAt, this.modelCopy.BlockTimeStartAt) &&
				valueEquals(this.model.BlockTimeStopAt, this.modelCopy.BlockTimeStopAt) &&
				valueEquals(this.model.StartAt, this.modelCopy.StartAt) &&
				valueEquals(this.model.StopAt, this.modelCopy.StopAt) &&
				valueEquals(this.model.EnumOvertimeTypeId, this.modelCopy.EnumOvertimeTypeId) &&
				valueEquals(this.model.AllowanceMatrixId, this.modelCopy.AllowanceMatrixId) &&
				valueEquals(this.model.OvertimeMatrixId, this.modelCopy.OvertimeMatrixId) &&
				valueEquals(this.model.EnumBreakTypeId, this.modelCopy.EnumBreakTypeId) &&
				valueEquals(this.model.EnumBreakCategoryTypeId, this.modelCopy.EnumBreakCategoryTypeId) &&
				valueEquals(this.model.LastCalculation, this.modelCopy.LastCalculation) &&
				valueEquals(this.model.Norm, this.modelCopy.Norm) &&
				valueEquals(this.model.SysDayScheduleBreak, this.modelCopy.SysDayScheduleBreak) &&
				valueEquals(this.model.SysDayScheduleRelativeBreak, this.modelCopy.SysDayScheduleRelativeBreak) &&
				valueEquals(this.model.SysDayScheduleRounding.ExitBookingUpFrom, this.modelCopy.SysDayScheduleRounding.ExitBookingUpFrom) &&
				valueEquals(this.model.SysDayScheduleRounding.ExitBookingRoundTo, this.modelCopy.SysDayScheduleRounding.ExitBookingRoundTo) &&
				valueEquals(this.model.SysDayScheduleRounding.EntryBookingUpFrom, this.modelCopy.SysDayScheduleRounding.EntryBookingUpFrom) &&
				valueEquals(this.model.SysDayScheduleRounding.EntryBookingRoundTo, this.modelCopy.SysDayScheduleRounding.EntryBookingRoundTo) &&
				valueEquals(this.model.SysDayScheduleRounding.EnumRoundingOfBookingSettingId, this.modelCopy.SysDayScheduleRounding.EnumRoundingOfBookingSettingId) &&
				valueEquals(this.model.SysDayScheduleRounding.EnumRoundingOfProjectBookingSettingId, this.modelCopy.SysDayScheduleRounding.EnumRoundingOfProjectBookingSettingId) &&
				valueEquals(this.model.BussinessTripStartAt, this.modelCopy.BussinessTripStartAt) &&
				valueEquals(this.model.BussinessTripStopAt, this.modelCopy.BussinessTripStopAt) &&
				valueEquals(this.model.CorrectionNormHours, this.modelCopy.CorrectionNormHours) &&
				valueEquals(this.model.AbsenceStartAt, this.modelCopy.AbsenceStartAt) &&
				valueEquals(this.model.AbsenceStopAt, this.modelCopy.AbsenceStopAt) &&
				valueEquals(this.model.ForgottenExitAt, this.modelCopy.ForgottenExitAt) &&
				valueEquals(this.model.ForceForgottenExit, this.modelCopy.ForceForgottenExit) &&
				valueEquals(this.model.ReentryAfter24Hrs, this.modelCopy.ReentryAfter24Hrs) &&
				valueEquals(this.model.ResultsForTomorrow, this.modelCopy.ResultsForTomorrow) &&
				valueEquals(this.model.Active, this.modelCopy.Active) &&
				valueEquals(this.model.SysDayScheduleNormboundOvertime, this.modelCopy.SysDayScheduleNormboundOvertime) &&
				valueEquals(this.model.SysDayScheduleEscapeSchedule1, this.modelCopy.SysDayScheduleEscapeSchedule1) &&
				valueEquals(this.model.SysDayScheduleCalculation.Type0, this.modelCopy.SysDayScheduleCalculation.Type0) &&
				valueEquals(this.model.SysDayScheduleCalculation.Type1, this.modelCopy.SysDayScheduleCalculation.Type1) &&
				valueEquals(this.model.SysDayScheduleCalculation.Type2, this.modelCopy.SysDayScheduleCalculation.Type2)
		},
		tableEntries: function () {
			return this.tableData
		}
	},
	watch: {
		details: {
			handler: function (val) {
				if (this.model.Id === val.Id) {
					this.clearValidationPromises()
				}
				this.model = this.getCopy(val)
				this.modelCopy = this.getCopy(this.model)
			},
			deep: true
		}
	},
	methods: {
		...mapActions('sysadmin/sysDaySchedule', {
			get: 'getDayScheduleList',
			getModelTranslations: 'getModelTranslations',
			getDayScheduleKeyValues: 'getDayScheduleKeyValues',
			getBreakTypeKeyValues: 'getBreakTypeKeyValues',
			getCounterKeyValues: 'getCounterKeyValues',
			getCalculationRules: 'getCalculationRules',
			getOvertimeTypeKeyValues: 'getOvertimeTypeKeyValues',
			getAllowanceMatrixKeyValues: 'getAllowanceMatrixKeyValues',
			getBookingSettingsKeyValues: 'getRoundingOfBookingSettingsKeyValues',
			getRelativeBreakSettingKeyValues: 'getRelativeBreakSettingKeyValues',
			getProjectBookingSettingsKeyValues: 'getRoundingOfProjectBookingSettingsKeyValues',
			getNormboundOvertimeSettingKeyValues: 'getNormboundOvertimeSettingKeyValues',
			getBreakTypeCategoryKeyValues: 'getBreakTypeCategoryKeyValues',
			getDetails: 'getDetailsDaySchedule',
			addDaySchedule: 'addDaySchedule',
			editDaySchedule: 'editDaySchedule',
			delete: 'removeDaySchedule',
			setValidationMessage: 'setValidationMessage',
			validateDayScheduleModel: 'validateDayScheduleModel',
			validateBreakModel: 'validateBreakModel',
			validateRelativeBreakModel: 'validateRelativeBreakModel',
			validateSwitchModel: 'validateSwitchModel',
			validateOvertimeModel: 'validateOvertimeModel',
			validateRoundingOfBookingSettingsModel: 'validateRoundingOfBookingSettingsModel'
		}),
		copySelected () {
			this.creationMode = !this.creationMode
			this.model = this.getCopy({
				...this.modelCopy,
				Id: null
			})
			this.modelCopy = this.getCopy(this.model)
			this.$router.push('day-schedules#overview')
		},
		saveEvent () {
			setTimeout(() => {
				Promise.all([
					this.daySchedulePromise,
					this.breakPromise,
					this.overtimePromise,
					this.switchPromise,
					this.bookingRoundingsPromise
				]).then(res => {
					if (res.some(i => i === false) || this.errors.items.length > 0) {
						this.triggerEvent(document, 'showErrors')
						return
					}
					this.$Progress.start()
					if (this.creationMode) {
						this.addDaySchedule(this.model)
							.then(() => {
								this.$Progress.finish()
								this.creationMode = false
							})
							.catch(() => {
								this.$Progress.fail()
							})
					} else {
						this.editDaySchedule({ model: this.model, modelCopy: this.modelCopy })
							.then(() => {
								this.$Progress.finish()
							})
							.catch(() => {
								this.$Progress.fail()
							})
					}
					this.clearValidationPromises()
					this.clearValidation()
				})
			}, 450) // TEMP SOLUTIONS!
		},
		deleteEvent () {
			if (!this.$refs.deleteConfirm) {
				return
			}
			this.$refs.deleteConfirm.show().then(confirmed => {
				if (!confirmed) {
					return
				}
				this.delete(this.model).then((response) => {
					if (response.status === 409) {
						this.$refs.errorDeleteModal.open()
					} else {
						this.selectFirst()
					}
				})
			})
		},
		cancelEvent () {
			if (this.creationMode) {
				this.selectFirst()
			} else {
				this.model = this.getCopy(this.modelCopy)
			}

			this.creationMode = false
			this.dayScheduleValidationState = {}
			this.breakValidationState = {}
			this.bookingRoundingsValidationState = {}
			this.switchValidationState = {}
			this.overtimeValidationState = {}
			this.clearValidationPromises()
			this.clearValidation()
		},
		addEvent () {
			this.creationMode = !this.creationMode
			this.model = this.getCopy(this.defaultModel)
			this.modelCopy = this.getCopy(this.defaultModel)
			this.$router.push('day-schedules#overview')
		},
		closeDeleteModal () {
			this.$refs.errorDeleteModal.close()
		},
		closeErrorModal () {
			this.setValidationMessage(null)
		},
		clearValidationPromises () {
			this.daySchedulePromise = {}
			this.breakPromise = {}
			this.bookingRoundingsPromise = {}
			this.switchPromise = {}
			this.overtimePromise = {}
		},
		getErrorMsgStyle () {
			return {
				position: 'absolute',
				width: 550 + 'px',
				top: 35 + 'px'
			}
		},
		checkDayScheduleModel () {
			this.daySchedulePromise = new Promise((resolve, reject) => {
				if (!valueEquals(this.model.DayStartAt, this.modelCopy.DayStartAt) ||
					!valueEquals(this.model.DayStopAt, this.modelCopy.DayStopAt) ||
					!valueEquals(this.model.AccessStartAt, this.modelCopy.AccessStartAt) ||
					!valueEquals(this.model.AccessStopAt, this.modelCopy.AccessStopAt) ||
					!valueEquals(this.model.OvertimeStartAt, this.modelCopy.OvertimeStartAt) ||
					!valueEquals(this.model.OvertimeStopAt, this.modelCopy.OvertimeStopAt) ||
					!valueEquals(this.model.BlockTimeStartAt, this.modelCopy.BlockTimeStartAt) ||
					!valueEquals(this.model.BlockTimeStopAt, this.modelCopy.BlockTimeStopAt) ||
					!valueEquals(this.model.StartAt, this.modelCopy.StartAt) ||
					!valueEquals(this.model.StopAt, this.modelCopy.StopAt) ||
					!valueEquals(this.model.BussinessTripStartAt, this.modelCopy.BussinessTripStartAt) ||
					!valueEquals(this.model.BussinessTripStopAt, this.modelCopy.BussinessTripStopAt) ||
					!valueEquals(this.model.CorrectionNormHours, this.modelCopy.CorrectionNormHours) ||
					!valueEquals(this.model.AbsenceStartAt, this.modelCopy.AbsenceStartAt) ||
					!valueEquals(this.model.AbsenceStopAt, this.modelCopy.AbsenceStopAt) ||
					!valueEquals(this.model.ForgottenExitAt, this.modelCopy.ForgottenExitAt)) {
					this.validateDayScheduleModel(this.model).then(res => {
						this.dayScheduleValidationState = {}
						resolve(true)
					}).catch(err => {
						if (err.status === 400) {
							this.dayScheduleValidationState = err.data.ModelState
						}
						resolve(false)
					})
				} else {
					this.dayScheduleValidationState = {}
					resolve(true)
				}
			})
		},
		checkBookingRoundingsModel () {
			this.bookingRoundingsPromise = new Promise((resolve, reject) => {
				if (!valueEquals(this.model.SysDayScheduleRounding.ExitBookingUpFrom, this.modelCopy.SysDayScheduleRounding.ExitBookingUpFrom) ||
					!valueEquals(this.model.SysDayScheduleRounding.ExitBookingRoundTo, this.modelCopy.SysDayScheduleRounding.ExitBookingRoundTo) ||
					!valueEquals(this.model.SysDayScheduleRounding.EntryBookingUpFrom, this.modelCopy.SysDayScheduleRounding.EntryBookingUpFrom) ||
					!valueEquals(this.model.SysDayScheduleRounding.EntryBookingRoundTo, this.modelCopy.SysDayScheduleRounding.EntryBookingRoundTo)) {
					this.validateRoundingOfBookingSettingsModel(this.model.SysDayScheduleRounding).then(res => {
						this.bookingRoundingsValidationState = {}
						resolve(true)
					}).catch(err => {
						if (err.status === 400) {
							this.bookingRoundingsValidationState = err.data.ModelState
						}
						resolve(false)
					})
				} else {
					this.bookingRoundingsValidationState = {}
					resolve(true)
				}
			})
		},
		checkBreakModel (name) {
			this.breakPromise = new Promise((resolve, reject) => {
				if (+this.model.EnumBreakTypeId === 0) {
					const breakModel = name.split('_')[1] ? this.model.SysDayScheduleBreak.find(i => i.Id === +name.split('_')[1]) : null
					if (breakModel) {
						this.validateBreakModel(breakModel).then(res => {
							if (this.breakValidationState[breakModel.Id]) {
								this.breakValidationState[breakModel.Id] = {}
							}
							resolve(true)
						}).catch(err => {
							if (err.status === 400) {
								Vue.set(this.breakValidationState, breakModel.Id, err.data.ModelState)
							}
							resolve(false)
						})
					} else {
						resolve(true)
					}
				} else {
					const relativeBreakModel = name.split('_')[1] ? this.model.SysDayScheduleRelativeBreak.find(i => i.Id === +name.split('_')[1]) : null
					if (relativeBreakModel) {
						this.validateRelativeBreakModel(relativeBreakModel).then(res => {
							if (this.relativeBreakValidationState[relativeBreakModel.Id]) {
								this.relativeBreakValidationState[relativeBreakModel.Id] = {}
							}
							resolve(true)
						}).catch(err => {
							if (err.status === 400) {
								Vue.set(this.relativeBreakValidationState, relativeBreakModel.Id, err.data.ModelState)
							}
							resolve(false)
						})
					} else {
						resolve(true)
					}
				}
			})
		},
		checkSwitchModel (name) {
			this.switchPromise = new Promise((resolve, reject) => {
				const switchModel = name.split('_')[1] ? this.model.SysDayScheduleEscapeSchedule1.find(i => i.Id === +name.split('_')[1]) : null
				if (switchModel) {
					this.validateSwitchModel(switchModel).then(res => {
						if (this.switchValidationState[switchModel.Id]) {
							this.switchValidationState[switchModel.Id] = {}
						}
						resolve(true)
					}).catch((res) => {
						if (res.status === 400) {
							Vue.set(this.switchValidationState, switchModel.Id, res.data.ModelState)
						}
						resolve(false)
					})
				} else {
					resolve(true)
				}
			})
		},
		checkOvertimeModel (name) {
			this.overtimePromise = new Promise((resolve, reject) => {
				const overtimeModel = name.split('_')[1] ? this.model.SysDayScheduleNormboundOvertime.find(i => i.Id === +name.split('_')[1]) : null
				if (overtimeModel) {
					this.validateOvertimeModel(overtimeModel).then(res => {
						if (this.overtimeValidationState[overtimeModel.Id]) {
							this.overtimeValidationState[overtimeModel.Id] = {}
						}
						resolve(true)
					}).catch((res) => {
						if (res.status === 400) {
							Vue.set(this.overtimeValidationState, overtimeModel.Id, res.data.ModelState)
						}
						resolve(false)
					})
				} else {
					resolve(true)
				}
			})
		},
		getDayScheduleModelErrorText (field) {
			const modelField = 'sysDaySchedule.' + field
			const errors = this.dayScheduleValidationState[modelField]
			if (errors) {
				return errors[0]
			}
		},
		getBookingRoundingsModelErrorText (field) {
			const modelField = 'sysDayScheduleRounding.' + field
			const errors = this.bookingRoundingsValidationState[modelField]
			if (errors) {
				return errors[0]
			}
		},
		getBreakModelErrorText (field, id) {
			let errors = null
			if (+this.model.EnumBreakTypeId === 0) {
				const modelField = 'sysDayScheduleBreak.' + field
				errors = this.breakValidationState[id] ? this.breakValidationState[id][modelField] : null
			} else {
				const modelField = 'sysDayScheduleRelativeBreak.' + field
				errors = this.relativeBreakValidationState[id] ? this.relativeBreakValidationState[id][modelField] : null
			}
			if (errors) {
				return errors[0]
			}
		},
		getSwitchModelErrorText (field, id) {
			const modelField = 'sysDayScheduleEscapeSchedule.' + field
			const errors = this.switchValidationState[id] ? this.switchValidationState[id][modelField] : null
			if (errors) {
				return errors[0]
			}
		},
		getOvertimeModelErrorText (field, id) {
			const modelField = 'sysDayScheduleNormboundOvertime.' + field
			const errors = this.overtimeValidationState[id] ? this.overtimeValidationState[id][modelField] : null
			if (errors) {
				return errors[0]
			}
		}
	},
	created () {
		this.getCounterKeyValues()
		this.getCalculationRules()
		this.getBreakTypeKeyValues()
		this.getDayScheduleKeyValues()
		this.getOvertimeTypeKeyValues()
		this.getBookingSettingsKeyValues()
		this.getBreakTypeCategoryKeyValues()
		this.getRelativeBreakSettingKeyValues()
	}
}
</script>


