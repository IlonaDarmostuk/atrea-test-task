/* global keyValueMapper, getChanges, getCopy */

import store from '@/store'
import http from '@/plugins/http'
import { sysDaySchedule,
	sysDayScheduleCalculation,
	sysDayScheduleBreak,
	sysEnumDayScheduleBreakType,
	enumRoundingOfBookingSetting,
	enumRoundingOfProjectBookingSetting,
	enumDayScheduleOvertimeType,
	enumSysAllowanceMatrix,
	enumNormboundOvertimeSetting,
	enumDayScheduleRelativeBreakSetting,
	sysDayScheduleRelativeBreak,
	sysDayScheduleRounding,
	sysDayScheduleNormboundOvertime,
	sysDayScheduleEscapeSchedule,
	enumDayScheduleBreakTypeCategory,
	sysCounter } from '@/app/api'
import { mapFromKeyValues } from '@/helpers/utils'
import { get, getKeyValue, set, removeByKey, httpCall } from '@/helpers/vuex'

const call = (methodHelper, data, completed, failed) => {
	const promise = http.call(methodHelper, data, completed, failed)
	promise.catch(error => {
		if (error.response.status === 409) {
			store.dispatch('sysadmin/sysDaySchedule/setValidationMessage', error.response.data)
		}
	})
}

let mapApiMethod = store.getters['app/mapApiMethod']
let getMethod = store.getters['app/apiMethod']
const labelTranslation = store.getters['app/labelTranslation']
const state = {
	validationMessage: null,
	modelTranslations: [],
	detailsDaySchedule: {},
	dayScheduleList: [],
	dayScheduleKeyValues: [],
	counterKeyValues: [],
	calculationRules: [],
	breakTypeKeyValues: [],
	breakTypeCategoryKeyValues: [],
	relativeBreakSettingKeyValues: [],
	overtimeTypeKeyValues: [],
	allowanceMatrixKeyValues: [],
	normboundOvertimeSettingKeyValues: [],
	roundingOfBookingSettingsKeyValues: [],
	roundingOfProjectBookingSettingsKeyValues: [],
	dayTypeKeyValue: [
		{
			label: labelTranslation('Normal'),
			value: 0
		},
		{
			label: labelTranslation('Holiday type 1'),
			value: 1
		},
		{
			label: labelTranslation('Holiday type 2'),
			value: 2
		}
	]
}

const actions = {
	setValidationMessage (context, message) {
		return context.commit('setValidationMessage', message)
	},
	validateDayScheduleModel (context, payload) {
		let body = {
			Id: payload.Id,
			Description: payload.Description,
			NormHours: TransformTimeToFloat(payload.NormHours),
			DayStartAt: payload.DayStartAt,
			DayStopAt: payload.DayStopAt,
			AccessStartAt: payload.AccessStartAt,
			AccessStopAt: payload.AccessStopAt,
			OvertimeStartAt: payload.OvertimeStartAt,
			OvertimeStopAt: payload.OvertimeStopAt,
			StartAt: payload.StartAt,
			StopAt: payload.StopAt,
			BlockTimeStartAt: payload.BlockTimeStartAt,
			BlockTimeStopAt: payload.BlockTimeStopAt,
			BussinessTripStartAt: payload.BussinessTripStartAt,
			BussinessTripStopAt: payload.BussinessTripStopAt,
			AbsenceStartAt: payload.AbsenceStartAt,
			AbsenceStopAt: payload.AbsenceStopAt,
			CorrectionNormHours: TransformTimeToFloat(payload.CorrectionNormHours),
			ForgottenExitAt: payload.ForgottenExitAt,
			ForceForgottenExit: payload.ForceForgottenExit ? 1 : 0,
			ReentryAfter24Hrs: payload.ReentryAfter24Hrs ? 1 : 0,
			ResultsForTomorrow: payload.ResultsForTomorrow ? 1 : 0,
			Active: payload.Active ? 1 : 0,
			ModifiedOn: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
			CustomerId: store.getters['app/currentUser'].CustomerId,
			AllowanceMatrixId: payload.AllowanceMatrixId,
			OvertimeMatrixId: payload.OvertimeMatrixId,
			EnumOvertimeTypeId: payload.EnumOvertimeTypeId,
			EnumBreakTypeId: payload.EnumBreakTypeId > 0 ? payload.EnumBreakCategoryTypeId : 0,
			SysDayScheduleRounding: null,
			SysDayScheduleBreak: null,
			SysDayScheduleRelativeBreak: null,
			SysDayScheduleNormboundOvertime: null,
			SysDayScheduleEscapeSchedule1: null
		}
		return validateModel(sysDaySchedule.validateModel, body)
	},
	validateBreakModel (context, body) {
		return validateModel(sysDayScheduleBreak.validateModel, {
			...body,
			NormHours: TransformTimeToFloat(body.NormHours)
		})
	},
	validateRelativeBreakModel (context, body) {
		return validateModel(sysDayScheduleRelativeBreak.validateModel, {
			...body,
			NormHours: TransformTimeToFloat(body.NormHours)
		})
	},
	validateSwitchModel (context, body) {
		return validateModel(sysDayScheduleEscapeSchedule.validateModel, body)
	},
	validateOvertimeModel (context, body) {
		return validateModel(sysDayScheduleNormboundOvertime.validateModel, {
			...body,
			NormHours: TransformTimeToFloat(body.NormHours),
			Threshold: TransformTimeToFloat(body.Threshold)
		})
	},
	validateRoundingOfBookingSettingsModel (context, payload) {
		let body = payload
		return validateModel(sysDayScheduleRounding.validateModel, body)
	},
	getModelTranslations: httpCall(mapApiMethod(sysDaySchedule.getModelTranslation), 'setModelTranslations', data => mapFromKeyValues(data)),
	getDayScheduleList: httpCall(mapApiMethod(sysDaySchedule.getList), 'setDayScheduleList'),
	getDayScheduleKeyValues: httpCall(mapApiMethod(sysDaySchedule.getKeyValues), 'setDayScheduleKeyValues'),
	getBreakTypeKeyValues: httpCall(mapApiMethod(sysEnumDayScheduleBreakType.getBreakTypeKeyValues), 'setBreakTypeKeyValues'),
	getBreakTypeCategoryKeyValues: httpCall(mapApiMethod(enumDayScheduleBreakTypeCategory.getBreakTypeCategoryKeyValues), 'setBreakTypeCategoryKeyValues'),
	getRelativeBreakSettingKeyValues: httpCall(mapApiMethod(enumDayScheduleRelativeBreakSetting.getRelativeBreakSettingKeyValues), 'setRelativeBreakSettingKeyValues'),
	getCounterKeyValues: httpCall(mapApiMethod(sysCounter.getKeyValues), 'setCounterKeyValues'),
	getNormboundOvertimeSettingKeyValues: httpCall(mapApiMethod(enumNormboundOvertimeSetting.getKeyValues), 'setNormboundOvertimeSettingKeyValues'),
	getOvertimeTypeKeyValues: httpCall(mapApiMethod(enumDayScheduleOvertimeType.getKeyValues), 'setOvertimeTypeKeyValues'),
	getAllowanceMatrixKeyValues: httpCall(mapApiMethod(enumSysAllowanceMatrix.getKeyValues), 'setAllowanceMatrixKeyValues'),
	getRoundingOfBookingSettingsKeyValues: httpCall(mapApiMethod(enumRoundingOfBookingSetting.getKeyValues), 'setRoundingOfBookingSettingsKeyValues'),
	getRoundingOfProjectBookingSettingsKeyValues: httpCall(mapApiMethod(enumRoundingOfProjectBookingSetting.getKeyValues), 'setRoundingOfProjectBookingSettingsKeyValues'),
	getCalculationRules: httpCall(mapApiMethod(sysDayScheduleCalculation.getKeyValues), 'setCalculationRules'),
	getDetailsDaySchedule (context, item) {
		http.call(getMethod(sysDaySchedule.getDetailsDaySchedule), item, result => {
			context.commit('setDetailsDaySchedule', MapDetailedResult(result[0]))
			if (resolveDelegate) {
				resolveDelegate(store.getters['sysadmin/sysDaySchedule/detailsDaySchedule'])
			}
		})
		let resolveDelegate = null
		return new Promise(resolve => {
			resolveDelegate = resolve
		})
	},
	addDaySchedule (context, payload) {
		let body = {
			Id: payload.Id,
			Description: payload.Description,
			NormHours: TransformTimeToFloat(payload.NormHours),
			DayStartAt: payload.DayStartAt,
			DayStopAt: payload.DayStopAt,
			AccessStartAt: payload.AccessStartAt,
			AccessStopAt: payload.AccessStopAt,
			OvertimeStartAt: payload.OvertimeStartAt,
			OvertimeStopAt: payload.OvertimeStopAt,
			StartAt: payload.StartAt,
			StopAt: payload.StopAt,
			BlockTimeStartAt: payload.BlockTimeStartAt,
			BlockTimeStopAt: payload.BlockTimeStopAt,
			BussinessTripStartAt: payload.BussinessTripStartAt,
			BussinessTripStopAt: payload.BussinessTripStopAt,
			AbsenceStartAt: payload.AbsenceStartAt,
			AbsenceStopAt: payload.AbsenceStopAt,
			CorrectionNormHours: TransformTimeToFloat(payload.CorrectionNormHours),
			ForgottenExitAt: payload.ForgottenExitAt,
			ForceForgottenExit: payload.ForceForgottenExit ? 1 : 0,
			ReentryAfter24Hrs: payload.ReentryAfter24Hrs ? 1 : 0,
			ResultsForTomorrow: payload.ResultsForTomorrow ? 1 : 0,
			Active: payload.Active ? 1 : 0,
			ModifiedOn: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
			CustomerId: store.getters['app/currentUser'].CustomerId,
			AllowanceMatrixId: payload.AllowanceMatrixId,
			OvertimeMatrixId: payload.OvertimeMatrixId,
			EnumOvertimeTypeId: payload.EnumOvertimeTypeId,
			EnumBreakTypeId: payload.EnumBreakTypeId > 0 ? payload.EnumBreakCategoryTypeId : 0,
			SysDayScheduleRounding: null,
			SysDayScheduleBreak: null,
			SysDayScheduleRelativeBreak: null,
			SysDayScheduleNormboundOvertime: null,
			SysDayScheduleEscapeSchedule1: null
		}
		call(getMethod(sysDaySchedule.add), body, result => {
			context.commit('addDaySchedule', result)
			if (payload.SysDayScheduleRounding) {
				const booking = {
					SysDayScheduleId: result.Id,
					CustomerId: store.getters['app/currentUser'].CustomerId,
					EnumRoundingOfBookingSettingId: payload.SysDayScheduleRounding.EnumRoundingOfBookingSettingId,
					EnumRoundingOfProjectBookingSettingId: payload.SysDayScheduleRounding.EnumRoundingOfProjectBookingSettingId,
					EntryBookingRoundTo: payload.SysDayScheduleRounding.EntryBookingRoundTo,
					EntryBookingUpFrom: payload.SysDayScheduleRounding.EntryBookingUpFrom,
					ExitBookingRoundTo: payload.SysDayScheduleRounding.ExitBookingRoundTo,
					ExitBookingUpFrom: payload.SysDayScheduleRounding.ExitBookingUpFrom,
					ModifiedOn: moment().utc().format('YYYY-MM-DD HH:mm:ss')
				}
				context.dispatch('addDayScheduleRounding', booking)
			}
			if (payload.SysDayScheduleBreak.length > 0) {
				const arr = payload.SysDayScheduleBreak.map((item) => {
					return {
						...item,
						NormHours: TransformTimeToFloat(item.NormHours),
						ValidWhenLastBookingAfter: payload.LastCalculation || '00:00',
						SysDayScheduleId: result.Id
					}
				})
				context.dispatch('addBreaks', arr)
			}
			if (payload.SysDayScheduleRelativeBreak.length > 0) {
				const arr = payload.SysDayScheduleRelativeBreak.map((item) => {
					return {
						...item,
						NormHours: TransformTimeToFloat(item.NormHours),
						ValidWhenLastBookingAfter: payload.LastCalculation || '00:00',
						SysDayScheduleId: result.Id
					}
				})
				context.dispatch('addRelativeBreaks', arr)
			}
			if (payload.SysDayScheduleEscapeSchedule1.length > 0) {
				context.dispatch('addSwitches', payload.SysDayScheduleEscapeSchedule1)
			}
			if (payload.SysDayScheduleNormboundOvertime.length > 0) {
				context.dispatch('addOvertime', { ParentId: result.Id, Data: payload.SysDayScheduleNormboundOvertime })
			}
			resolveDelegate(true)
		}, err => rejectDelegate(err.response))

		let resolveDelegate = null
		let rejectDelegate = null
		return new Promise((resolve, reject) => {
			resolveDelegate = resolve
			rejectDelegate = reject
		})
	},
	addRule (context, payload) {
		http.call(getMethod(sysDayScheduleCalculation.add), payload, result => {
			context.commit('setCalculationRulesToDetails', result)
			if (resolveDelegate) {
				resolveDelegate(true)
			}
		})
		let resolveDelegate = null
		return new Promise(resolve => {
			resolveDelegate = resolve
		})
	},
	removeRule (context, payload) {
		http.call(getMethod(sysDayScheduleCalculation.remove), payload, result => {
			context.commit('removeCalculationRulesFromDetails', result)
			if (resolveDelegate) {
				resolveDelegate(true)
			}
		})
		let resolveDelegate = null
		return new Promise(resolve => {
			resolveDelegate = resolve
		})
	},
	addCalculationRules (context, payload) {
		connectCustomerIdAndModifiedOn(payload)
		let promises = []
		payload.forEach((item) => {
			promises.push(context.dispatch('addRule', {...item, SysCalculation: null}))
		})
		Promise.all([
			...promises
		]).then(() => {
			if (resolveDelegate) {
				resolveDelegate(true)
			}
		})
		let resolveDelegate = null
		return new Promise(resolve => {
			resolveDelegate = resolve
		})
	},
	removeCalculationRules (context, payload) {
		let promises = []
		payload.forEach((item) => {
			promises.push(context.dispatch('removeRule', item))
		})
		Promise.all([
			...promises
		]).then(() => {
			if (resolveDelegate) {
				resolveDelegate(true)
			}
		})
		let resolveDelegate = null
		return new Promise(resolve => {
			resolveDelegate = resolve
		})
	},
	addBreaks (context, payload) {
		connectCustomerIdAndModifiedOn(payload)
		return call(getMethod(sysDayScheduleBreak.add), payload, result => {
			context.commit('setBreak', result)
		})
	},
	addRelativeBreaks (context, payload) {
		connectCustomerIdAndModifiedOn(payload)
		return call(getMethod(sysDayScheduleRelativeBreak.add), payload, result => {
			context.commit('setRelativeBreak', result)
		})
	},
	removeRelativeBreaks: httpCall(mapApiMethod(sysDayScheduleRelativeBreak.remove), (data, context, payload) => { context.commit('removeRelativeBreaks', payload) }),
	addOvertime (context, payload) {
		const items = payload.Data.map((item) => {
			return {
				...item,
				SysCounterId: item.SysCounterId ? item.SysCounterId : 0,
				NormHours: TransformTimeToFloat(item.NormHours),
				Threshold: TransformTimeToFloat(item.Threshold),
				SysDayScheduleId: payload.ParentId
			}
		})
		connectCustomerIdAndModifiedOn(items)
		return call(getMethod(sysDayScheduleNormboundOvertime.add), items, result => {
			context.commit('setOvertime', result)
		})
	},
	addSwitches (context, payload) {
		connectCustomerIdAndModifiedOn(payload)
		return call(getMethod(sysDayScheduleEscapeSchedule.add), payload, result => {
			context.commit('setSwitches', result)
		})
	},
	addDayScheduleRounding (context, payload) {
		return call(getMethod(sysDayScheduleRounding.add), payload, result => {
			context.commit('setDayScheduleRounding', result)
		})
	},
	removeSwitches: httpCall(mapApiMethod(sysDayScheduleEscapeSchedule.remove), (data, context, payload) => { context.commit('removeSwitches', payload) }),
	removeDayScheduleRounding: httpCall(mapApiMethod(sysDayScheduleRounding.remove), (data, context, payload) => { context.commit('removeDayScheduleRounding', payload) }),
	removeDayScheduleOvertime: httpCall(mapApiMethod(sysDayScheduleNormboundOvertime.remove), (data, context, payload) => { context.commit('removeDayScheduleOvertime', payload) }),
	removeBreaks: httpCall(mapApiMethod(sysDayScheduleBreak.remove), (data, context, payload) => { context.commit('removeBreaks', payload) }),
	removeDaySchedule (context, payload) {
		const body = {
			Id: payload.Id,
			Description: payload.Description,
			NormHours: TransformTimeToFloat(payload.NormHours),
			DayStartAt: payload.DayStartAt,
			DayStopAt: payload.DayStopAt,
			AccessStartAt: payload.AccessStartAt,
			AccessStopAt: payload.AccessStopAt,
			OvertimeStartAt: payload.OvertimeStartAt,
			OvertimeStopAt: payload.OvertimeStopAt,
			StartAt: payload.StartAt,
			StopAt: payload.StopAt,
			BlockTimeStartAt: payload.BlockTimeStartAt,
			BlockTimeStopAt: payload.BlockTimeStopAt,
			BussinessTripStartAt: payload.BussinessTripStartAt,
			BussinessTripStopAt: payload.BussinessTripStopAt,
			AbsenceStartAt: payload.AbsenceStartAt,
			AbsenceStopAt: payload.AbsenceStopAt,
			CorrectionNormHours: TransformTimeToFloat(payload.CorrectionNormHours),
			ForgottenExitAt: payload.ForgottenExitAt,
			ForceForgottenExit: payload.ForceForgottenExit ? 1 : 0,
			ReentryAfter24Hrs: payload.ReentryAfter24Hrs ? 1 : 0,
			ResultsForTomorrow: payload.ResultsForTomorrow ? 1 : 0,
			Active: payload.Active ? 1 : 0,
			ModifiedOn: payload.ModifiedOn,
			CustomerId: payload.CustomerId,
			SysDayScheduleRounding: null,
			SysDayScheduleBreak: null,
			SysDayScheduleRelativeBreak: null,
			SysDayScheduleNormboundOvertime: null,
			SysDayScheduleEscapeSchedule1: null
		}
		http.call(getMethod(sysDaySchedule.remove), body, result => {
			context.commit('removeDaySchedule', result)
			if (resolveDelegate) {
				resolveDelegate(result)
			}
		}, error => {
			if (resolveDelegate) {
				resolveDelegate(error.response)
			}
		})
		let resolveDelegate = null

		return new Promise(resolve => {
			resolveDelegate = resolve
		})
	},
	editBreaks (context, payload) {
		payload.forEach(item => {
			item.NormHours = TransformTimeToFloat(item.NormHours)
		})
		return call(getMethod(sysDayScheduleBreak.edit), payload, result => {
			result.forEach(item => {
				item.NormHours = TransformTimeToString(item.NormHours)
			})
			context.commit('editBreaks', result)
		})
	},
	editRelativeBreaks (context, payload) {
		payload.forEach(item => {
			item.NormHours = TransformTimeToFloat(item.NormHours)
		})
		return call(getMethod(sysDayScheduleRelativeBreak.edit), payload, result => {
			result.forEach(item => {
				item.NormHours = TransformTimeToString(item.NormHours)
			})
			context.commit('editRelativeBreaks', result)
		})
	},
	editOvertime (context, payload) {
		payload.forEach(item => {
			item.NormHours = TransformTimeToFloat(item.NormHours)
			item.Threshold = TransformTimeToFloat(item.Threshold)
		})
		return call(getMethod(sysDayScheduleNormboundOvertime.edit), payload, result => {
			context.commit('editOvertime', result)
		})
	},
	editSwitches (context, payload) {
		return call(getMethod(sysDayScheduleEscapeSchedule.edit), payload, result => {
			context.commit('editSwitches', result)
		})
	},
	editCalculationRule (context, payload) {
		const body = payload.map(i => {
			return {
				...i,
				SysCalculation: null
			}
		})
		return http.call(getMethod(sysDayScheduleCalculation.edit), body, result => {
			context.commit('editCalculationRule', result)
		})
	},
	editMainDaySchedule (context, payload) {
		return call(getMethod(sysDaySchedule.edit), payload, result => {
			context.commit('editDaySchedule', MapDetailedResult(result))
		})
	},
	editBookingRounding (context, payload) {
		return call(getMethod(sysDayScheduleRounding.edit), payload, result => {
			context.commit('setBookingRounding', MapDetailedResult(result))
		})
	},
	editDaySchedule (context, payload) {
		if (payload.model.Description !== payload.modelCopy.Description ||
			payload.model.NormHours !== payload.modelCopy.NormHours ||
			payload.model.DayStartAt !== payload.modelCopy.DayStartAt ||
			payload.model.DayStopAt !== payload.modelCopy.DayStopAt ||
			payload.model.AccessStartAt !== payload.modelCopy.AccessStartAt ||
			payload.model.AccessStopAt !== payload.modelCopy.AccessStopAt ||
			payload.model.OvertimeStartAt !== payload.modelCopy.OvertimeStartAt ||
			payload.model.OvertimeStopAt !== payload.modelCopy.OvertimeStopAt ||
			payload.model.StartAt !== payload.modelCopy.StartAt ||
			payload.model.StopAt !== payload.modelCopy.StopAt ||
			payload.model.BlockTimeStartAt !== payload.modelCopy.BlockTimeStartAt ||
			payload.model.BlockTimeStopAt !== payload.modelCopy.BlockTimeStopAt ||
			payload.model.EnumBreakTypeId !== payload.modelCopy.EnumBreakTypeId ||
			payload.model.EnumOvertimeTypeId !== payload.modelCopy.EnumOvertimeTypeId ||
			payload.model.OvertimeMatrixId !== payload.modelCopy.OvertimeMatrixId ||
			payload.model.AllowanceMatrixId !== payload.modelCopy.AllowanceMatrixId ||
			payload.model.BussinessTripStartAt !== payload.modelCopy.BussinessTripStartAt ||
			payload.model.BussinessTripStopAt !== payload.modelCopy.BussinessTripStopAt ||
			payload.model.AbsenceStartAt !== payload.modelCopy.AbsenceStartAt ||
			payload.model.AbsenceStopAt !== payload.modelCopy.AbsenceStopAt ||
			payload.model.CorrectionNormHours !== payload.modelCopy.CorrectionNormHours ||
			payload.model.ForgottenExitAt !== payload.modelCopy.ForgottenExitAt ||
			payload.model.ForceForgottenExit !== payload.modelCopy.ForceForgottenExit ||
			payload.model.ReentryAfter24Hrs !== payload.modelCopy.ReentryAfter24Hrs ||
			payload.model.ResultsForTomorrow !== payload.modelCopy.ResultsForTomorrow ||
			payload.model.Active !== payload.modelCopy.Active) {
			const body = {
				Id: payload.model.Id,
				Description: payload.model.Description,
				NormHours: TransformTimeToFloat(payload.model.NormHours),
				DayStartAt: payload.model.DayStartAt,
				DayStopAt: payload.model.DayStopAt,
				AccessStartAt: payload.model.AccessStartAt,
				AccessStopAt: payload.model.AccessStopAt,
				OvertimeStartAt: payload.model.OvertimeStartAt,
				OvertimeStopAt: payload.model.OvertimeStopAt,
				StartAt: payload.model.StartAt,
				StopAt: payload.model.StopAt,
				BlockTimeStartAt: payload.model.BlockTimeStartAt,
				BlockTimeStopAt: payload.model.BlockTimeStopAt,
				BussinessTripStartAt: payload.model.BussinessTripStartAt,
				BussinessTripStopAt: payload.model.BussinessTripStopAt,
				AbsenceStartAt: payload.model.AbsenceStartAt,
				AbsenceStopAt: payload.model.AbsenceStopAt,
				CorrectionNormHours: TransformTimeToFloat(payload.model.CorrectionNormHours),
				ForgottenExitAt: payload.model.ForgottenExitAt,
				ForceForgottenExit: payload.model.ForceForgottenExit ? 1 : 0,
				ReentryAfter24Hrs: payload.model.ReentryAfter24Hrs ? 1 : 0,
				ResultsForTomorrow: payload.model.ResultsForTomorrow ? 1 : 0,
				Active: payload.model.Active ? 1 : 0,
				ModifiedOn: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
				CustomerId: store.getters['app/currentUser'].CustomerId,
				AllowanceMatrixId: payload.model.AllowanceMatrixId,
				OvertimeMatrixId: payload.model.OvertimeMatrixId,
				EnumOvertimeTypeId: payload.model.EnumOvertimeTypeId,
				EnumBreakTypeId: payload.model.EnumBreakTypeId > 0 ? payload.model.EnumBreakCategoryTypeId : 0
			}
			context.dispatch('editMainDaySchedule', body)
		}
		if (+payload.model.EnumBreakTypeId === 0 && (payload.model.LastCalculation !== payload.modelCopy.LastCalculation || JSON.stringify(payload.model.SysDayScheduleBreak) !== JSON.stringify(payload.modelCopy.SysDayScheduleBreak))) {
			updateBreaks(context, payload.model.Id, payload.model.LastCalculation, payload.model.SysDayScheduleBreak, payload.modelCopy.SysDayScheduleBreak)
		}
		if (+payload.model.EnumBreakTypeId > 0 && (payload.model.LastCalculation !== payload.modelCopy.LastCalculation || JSON.stringify(payload.model.SysDayScheduleRelativeBreak) !== JSON.stringify(payload.modelCopy.SysDayScheduleRelativeBreak))) {
			updateRelativeBreaks(context, payload.model.Id, payload.model.LastCalculation, payload.model.SysDayScheduleRelativeBreak, payload.modelCopy.SysDayScheduleRelativeBreak)
		}
		if (JSON.stringify(payload.model.SysDayScheduleEscapeSchedule1) !== JSON.stringify(payload.modelCopy.SysDayScheduleEscapeSchedule1)) {
			updateSwitches(context, payload.model.SysDayScheduleEscapeSchedule1, payload.modelCopy.SysDayScheduleEscapeSchedule1)
		}
		if (JSON.stringify(payload.model.SysDayScheduleNormboundOvertime) !== JSON.stringify(payload.modelCopy.SysDayScheduleNormboundOvertime)) {
			updateOvertime(context, payload.model.Id, payload.model.SysDayScheduleNormboundOvertime, payload.modelCopy.SysDayScheduleNormboundOvertime)
		}
		if (JSON.stringify(payload.model.SysDayScheduleRounding) !== JSON.stringify(payload.modelCopy.SysDayScheduleRounding)) {
			context.dispatch('editBookingRounding', payload.model.SysDayScheduleRounding)
		}
		if (JSON.stringify(payload.model.SysDayScheduleCalculation) !== JSON.stringify(payload.modelCopy.SysDayScheduleCalculation)) {
			updateCalculationRules(context, payload.model.SysDayScheduleCalculation, payload.modelCopy.SysDayScheduleCalculation)
		}
	},
	removeOvertime (context, payload) {
		payload.forEach(item => {
			item.SysCounterId = item.SysCounterId ? item.SysCounterId : 0
			item.NormHours = TransformTimeToFloat(item.NormHours)
			item.Threshold = TransformTimeToFloat(item.Threshold)
		})
		return http.call(getMethod(sysDayScheduleNormboundOvertime.remove), payload, result => {
			context.commit('removeOvertime', result)
		})
	}
}

const getters = {
	modelTranslation: getKeyValue('modelTranslations'),
	dayScheduleList: get('dayScheduleList'),
	breakTypeKeyValues: state => state.breakTypeKeyValues.map(keyValueMapper),
	breakTypeCategoryKeyValues: state => state.breakTypeCategoryKeyValues.map(keyValueMapper),
	roundingOfBookingKeyValues: state => state.roundingOfBookingSettingsKeyValues.map(keyValueMapper),
	roundingOfProjectBookingKeyValues: state => state.roundingOfProjectBookingSettingsKeyValues.map(keyValueMapper),
	detailsDaySchedule: state => {
		return {
			...state.detailsDaySchedule,
			EnumBreakTypeId: state.detailsDaySchedule.EnumBreakTypeId > 0 ? 1 : 0,
			EnumBreakCategoryTypeId: state.detailsDaySchedule.EnumBreakTypeId > 0 ? state.detailsDaySchedule.EnumBreakTypeId : 1,
			LastCalculation: state.detailsDaySchedule.EnumBreakTypeId === 0
				? state.detailsDaySchedule.SysDayScheduleBreak && state.detailsDaySchedule.SysDayScheduleBreak.length === 5
					? state.detailsDaySchedule.SysDayScheduleBreak[4].ValidWhenLastBookingAfter : null
				: state.detailsDaySchedule.SysDayScheduleRelativeBreak && state.detailsDaySchedule.SysDayScheduleRelativeBreak.length === 5
					? state.detailsDaySchedule.SysDayScheduleRelativeBreak[4].ValidWhenLastBookingAfter : null
		}
	},
	dayTypeKeyValue: get('dayTypeKeyValue'),
	getEnableRules: state => (dayType, sysDayScheduleCalculation) => {
		return state.calculationRules.map(i => {
			return {
				...i,
				Disabled: sysDayScheduleCalculation && sysDayScheduleCalculation['Type' + dayType].some(c => c.CalculationId === i.Key)
			}
		})
	},
	normboundOvertimeSettingKeyValues: state => state.normboundOvertimeSettingKeyValues.map(keyValueMapper),
	overtimeTypeKeyValues: state => state.overtimeTypeKeyValues.map(keyValueMapper),
	dayScheduleKeyValues: state => state.dayScheduleKeyValues.map(keyValueMapper),
	allowanceMatrixKeyValues: state => {
		let list = state.allowanceMatrixKeyValues.map(keyValueMapper)
		list.unshift({ label: '', value: null })
		return list
	},
	counterKeyValues: state => state.counterKeyValues.map(keyValueMapper),
	relativeBreakSettingKeyValues: state => state.relativeBreakSettingKeyValues.map(keyValueMapper),
	validationMessage: state => state.validationMessage
}

const mutations = {
	setValidationMessage (state, message) {
		state.validationMessage = message
	},
	setModelTranslations: set('modelTranslations'),
	setDayScheduleList: set('dayScheduleList'),
	setDayScheduleKeyValues: set('dayScheduleKeyValues'),
	setBreakTypeKeyValues: set('breakTypeKeyValues'),
	setBreakTypeCategoryKeyValues: set('breakTypeCategoryKeyValues'),
	setRelativeBreakSettingKeyValues: set('relativeBreakSettingKeyValues'),
	setBreak (state, data) {
		const arr = ReplaceTimeInArray(data, 'NormHours')
		state.detailsDaySchedule.LastCalculation = arr[0].ValidWhenLastBookingAfter
		state.detailsDaySchedule.SysDayScheduleBreak.push(...arr)
	},
	setRelativeBreak (state, data) {
		const arr = ReplaceTimeInArray(data, 'NormHours')
		state.detailsDaySchedule.LastCalculation = arr[0].ValidWhenLastBookingAfter
		state.detailsDaySchedule.SysDayScheduleRelativeBreak.push(...arr)
	},
	setDetailsDaySchedule: set('detailsDaySchedule'),
	setRoundingOfBookingSettingsKeyValues: set('roundingOfBookingSettingsKeyValues'),
	setRoundingOfProjectBookingSettingsKeyValues: set('roundingOfProjectBookingSettingsKeyValues'),
	setOvertimeTypeKeyValues: set('overtimeTypeKeyValues'),
	setAllowanceMatrixKeyValues: set('allowanceMatrixKeyValues'),
	setNormboundOvertimeSettingKeyValues: set('normboundOvertimeSettingKeyValues'),
	setCounterKeyValues: set('counterKeyValues'),
	setSwitches (state, data) {
		state.detailsDaySchedule.SysDayScheduleEscapeSchedule1.push(...data)
	},
	setOvertime (state, data) {
		const arr = ReplaceTimeInArray(data, 'NormHours', 'Threshold')
		state.detailsDaySchedule.SysDayScheduleNormboundOvertime.push(...arr)
	},
	setBookingRounding (state, data) {
		state.detailsDaySchedule.SysDayScheduleRounding = {...data}
	},
	setCalculationRules: set('calculationRules'),
	addDaySchedule (state, data) {
		const item = {
			ApiTime: null,
			CustomerId: data.CustomerId,
			Id: data.Id,
			ModifiedOn: data.ModifiedOn,
			Name: data.Description,
			NormHours: data.NormHours,
			StartAt: data.StartAt,
			StopAt: data.StopAt
		}
		state.dayScheduleList.push(item)
		state.detailsDaySchedule = MapDetailedResult(data)
	},
	editDaySchedule (state, data) {
		let item = {
			...state.detailsDaySchedule,
			Id: data.Id,
			Description: data.Description,
			NormHours: data.NormHours,
			DayStartAt: data.DayStartAt,
			DayStopAt: data.DayStopAt,
			AccessStartAt: data.AccessStartAt,
			AccessStopAt: data.AccessStopAt,
			OvertimeStartAt: data.OvertimeStartAt,
			OvertimeStopAt: data.OvertimeStopAt,
			StartAt: data.StartAt,
			StopAt: data.StopAt,
			BlockTimeStartAt: data.BlockTimeStartAt,
			BlockTimeStopAt: data.BlockTimeStopAt,
			BussinessTripStartAt: data.BussinessTripStartAt,
			BussinessTripStopAt: data.BussinessTripStopAt,
			AbsenceStartAt: data.AbsenceStartAt,
			AbsenceStopAt: data.AbsenceStopAt,
			CorrectionNormHours: data.CorrectionNormHours,
			ForgottenExitAt: data.ForgottenExitAt,
			ForceForgottenExit: data.ForceForgottenExit,
			ReentryAfter24Hrs: data.ReentryAfter24Hrs,
			ResultsForTomorrow: data.ResultsForTomorrow,
			Active: data.Active,
			ModifiedOn: data.ModifiedOn,
			CustomerId: data.CustomerId,
			AllowanceMatrixId: data.AllowanceMatrixId,
			OvertimeMatrixId: data.OvertimeMatrixId,
			EnumOvertimeTypeId: data.EnumOvertimeTypeId,
			EnumBreakTypeId: data.EnumBreakTypeId
		}
		state.detailsDaySchedule = item
		const index = state.dayScheduleList.findIndex(e => e.Id === data.Id)
		if (index >= 0) {
			const item = {
				ApiTime: null,
				CustomerId: data.CustomerId,
				Id: data.Id,
				ModifiedOn: data.ModifiedOn,
				Name: data.Description,
				NormHours: data.NormHours,
				StartAt: data.StartAt,
				StopAt: data.StopAt
			}
			state.dayScheduleList.splice(index, 1, item)
		}
	},
	setDayScheduleRounding (state, data) {
		state.detailsDaySchedule.SysDayScheduleRounding = data
	},
	setCalculationRulesToDetails (state, data) {
		let initArray = [...state.detailsDaySchedule.SysDayScheduleCalculation['Type' + data.Type]]
		initArray.push(data)
		initArray.sort((a, b) => a.Id - b.Id)
		state.detailsDaySchedule.SysDayScheduleCalculation['Type' + data.Type] = initArray
	},
	removeCalculationRulesFromDetails (state, data) {
		const index = state.detailsDaySchedule.SysDayScheduleCalculation['Type' + data.Type].findIndex(e => e.Id === data.Id)
		if (index >= 0) {
			state.detailsDaySchedule.SysDayScheduleCalculation['Type' + data.Type].splice(index, 1)
		}
	},
	removeBreaks (state, data) {
		data.forEach(item => {
			const index = state.detailsDaySchedule.SysDayScheduleBreak.findIndex(e => e.Id === item.Id)
			if (index >= 0) {
				state.detailsDaySchedule.SysDayScheduleBreak.splice(index, 1)
			}
		})
		if (state.detailsDaySchedule.EnumBreakTypeId === 0 && state.detailsDaySchedule.SysDayScheduleBreak.length === 0) state.detailsDaySchedule.LastCalculation = null
		if (state.detailsDaySchedule.SysDayScheduleRelativeBreak.length === 0) state.detailsDaySchedule.LastCalculation = state.detailsDaySchedule.SysDayScheduleRelativeBreak[4].LastCalculation
	},
	removeRelativeBreaks (state, data) {
		data.forEach(item => {
			const index = state.detailsDaySchedule.SysDayScheduleRelativeBreak.findIndex(e => e.Id === item.Id)
			if (index >= 0) {
				state.detailsDaySchedule.SysDayScheduleRelativeBreak.splice(index, 1)
			}
		})
		if (state.detailsDaySchedule.EnumBreakTypeId !== 0 && state.detailsDaySchedule.SysDayScheduleRelativeBreak.length === 0) state.detailsDaySchedule.LastCalculation = null
		if (state.detailsDaySchedule.SysDayScheduleBreak.length === 0) state.detailsDaySchedule.LastCalculation = state.detailsDaySchedule.SysDayScheduleBreak[4].LastCalculation
	},
	removeDaySchedule: removeByKey('dayScheduleList', 'Id'),
	removeOvertime (state, data) {
		data.forEach(item => {
			const index = state.detailsDaySchedule.SysDayScheduleNormboundOvertime.findIndex(e => e.Id === item.Id)
			if (index >= 0) {
				state.detailsDaySchedule.SysDayScheduleNormboundOvertime.splice(index, 1)
			}
		})
	},
	removeSwitches (state, data) {
		data.forEach(item => {
			const index = state.detailsDaySchedule.SysDayScheduleEscapeSchedule1.findIndex(e => e.Id === item.Id)
			if (index >= 0) {
				state.detailsDaySchedule.SysDayScheduleEscapeSchedule1.splice(index, 1)
			}
		})
	},
	editBreaks (state, data) {
		state.detailsDaySchedule.LastCalculation = data[data.length - 1].ValidWhenLastBookingAfter
		data.forEach(item => {
			const index = state.detailsDaySchedule.SysDayScheduleBreak.findIndex(e => e.Id === item.Id)
			if (index >= 0) {
				state.detailsDaySchedule.SysDayScheduleBreak.splice(index, 1, item)
			}
		})
	},
	editRelativeBreaks (state, data) {
		state.detailsDaySchedule.LastCalculation = data[data.length - 1].ValidWhenLastBookingAfter
		data.forEach(item => {
			const index = state.detailsDaySchedule.SysDayScheduleRelativeBreak.findIndex(e => e.Id === item.Id)
			if (index >= 0) {
				state.detailsDaySchedule.SysDayScheduleRelativeBreak.splice(index, 1, item)
			}
		})
	},
	editOvertime (state, data) {
		const arr = ReplaceTimeInArray(data, 'NormHours', 'Threshold')
		arr.forEach(item => {
			const index = state.detailsDaySchedule.SysDayScheduleNormboundOvertime.findIndex(e => e.Id === item.Id)
			if (index >= 0) {
				state.detailsDaySchedule.SysDayScheduleNormboundOvertime.splice(index, 1, item)
			}
		})
	},
	editCalculationRule (state, data) {
		data.forEach(item => {
			const index = state.detailsDaySchedule.SysDayScheduleCalculation['Type' + item.Type].findIndex(e => e.CalculationId === item.CalculationId)
			if (index >= 0) {
				state.detailsDaySchedule.SysDayScheduleCalculation['Type' + item.Type].splice(index, 1, item)
				let initArray = state.detailsDaySchedule.SysDayScheduleCalculation['Type' + item.Type]
				initArray.sort((a, b) => a.Id - b.Id)
				state.detailsDaySchedule.SysDayScheduleCalculation['Type' + item.Type] = initArray
			}
		})
	},
	editSwitches (state, data) {
		data.forEach(item => {
			const index = state.detailsDaySchedule.SysDayScheduleEscapeSchedule1.findIndex(e => e.Id === item.Id)
			if (index >= 0) {
				state.detailsDaySchedule.SysDayScheduleEscapeSchedule1.splice(index, 1, item)
			}
		})
	}
}

store.registerModule(['sysadmin', 'sysDaySchedule'], {
	namespaced: true,
	state,
	actions,
	getters,
	mutations
})

const TransformTimeToString = (time) => {
	if (time) {
		let timeArr = time.toString().split('.')
		if (timeArr.length === 2) {
			let minutes = timeArr[1] && timeArr[1].length === 1 ? timeArr[1] + '0' : timeArr[1]
			return moment({ hours: timeArr[0], minutes: minutes }).format('HH:mm')
		}
		if (timeArr.length === 1) return moment({ hours: timeArr[0], minutes: 0 }).format('HH:mm')
	}
	return '00:00'
}

const getRemovedItems = (arr1, arr2, field) => {
	return arr2.filter((obj) => {
		return !arr1.some((obj2) => obj.Id === obj2.Id && (field ? obj[field] === obj2[field] : true))
	})
}

const getAddedItems = (arr1, arr2, field) => {
	return arr1.filter((obj) => {
		return !arr2.some((obj2) => obj.Id === obj2.Id && (field ? obj[field] === obj2[field] : true))
	})
}

const TransformTimeToFloat = (time) => {
	if (time) {
		const field = moment(time, 'HH:mm').format('HH.mm')
		return parseFloat(field)
	}
}

const MapDetailedResult = (item) => {
	return {
		...item,
		ForceForgottenExit: !!item.ForceForgottenExit,
		ReentryAfter24Hrs: !!item.ReentryAfter24Hrs,
		ResultsForTomorrow: !!item.ResultsForTomorrow,
		Active: !!item.Active,
		NormHours: ReplaceTime(item, 'NormHours'),
		CorrectionNormHours: ReplaceTime(item, 'CorrectionNormHours'),
		SysDayScheduleBreak: item.SysDayScheduleBreak ? ReplaceTimeInArray(item.SysDayScheduleBreak, 'NormHours') : [],
		SysDayScheduleRelativeBreak: item.SysDayScheduleRelativeBreak ? ReplaceTimeInArray(item.SysDayScheduleRelativeBreak, 'NormHours') : [],
		SysDayScheduleNormboundOvertime: item.SysDayScheduleNormboundOvertime ? ReplaceTimeInArray(item.SysDayScheduleNormboundOvertime, 'NormHours', 'Threshold') : [],
		SysDayScheduleCalculation: item.SysDayScheduleCalculation ? DivideCalculationRules(item.SysDayScheduleCalculation) : {},
		SysDayScheduleEscapeSchedule1: item.SysDayScheduleEscapeSchedule1 ? item.SysDayScheduleEscapeSchedule1 : [],
		EnumBreakTypeId: item.EnumBreakTypeId > 0 ? 1 : 0,
		EnumBreakCategoryTypeId: item.EnumBreakTypeId > 0 ? item.EnumBreakTypeId : 1,
		SysDayScheduleRounding: item.SysDayScheduleRounding ? item.SysDayScheduleRounding : {
			EnumRoundingOfBookingSettingId: 1,
			EnumRoundingOfProjectBookingSettingId: 1,
			EntryBookingRoundTo: '',
			EntryBookingUpFrom: '',
			ExitBookingRoundTo: '',
			ExitBookingUpFrom: ''
		},
		LastCalculation: item.EnumBreakTypeId === 0
			? item.SysDayScheduleBreak && item.SysDayScheduleBreak.length === 5
				? item.SysDayScheduleBreak[4].ValidWhenLastBookingAfter : null
			: item.SysDayScheduleRelativeBreak && item.SysDayScheduleRelativeBreak.length === 5
				? item.SysDayScheduleRelativeBreak[4].ValidWhenLastBookingAfter : null
	}
}

const DivideCalculationRules = (items) => {
	return {
		Type0: items.filter(i => i.Type === 0),
		Type1: items.filter(i => i.Type === 1),
		Type2: items.filter(i => i.Type === 2)
	}
}

const ReplaceTime = (item, field) => {
	if (item.ApiTime) {
		let apiValue = item.ApiTime.find(i => i.Property === field)
		if (apiValue) return apiValue.Time
	}
	return TransformTimeToString(item[field])
}

const ReplaceTimeInArray = (arr, field1, field2) => {
	return arr.map(e => {
		return field2 ? {
			...e,
			[field1]: ReplaceTime(e, field1),
			[field2]: ReplaceTime(e, field2)
		} : {
			...e,
			[field1]: ReplaceTime(e, field1)
		}
	})
}

const connectCustomerIdAndModifiedOn = (arr, id = 3) => {
	arr.forEach((i) => {
		i.CustomerId = id
		i.ModifiedOn = moment().utc().format('YYYY-MM-DD HH:mm:ss')
	})
}

const updateBreaks = (context, parentId, lastCalculationValue, origin, copy) => {
	let origin1 = [...origin]
	let copy1 = [...copy]
	let lastCalculation = lastCalculationValue || '00:00'
	const removed = getRemovedItems(origin, copy)
	if (removed.length > 0) {
		const arr = removed.map((item) => {
			return {
				...item,
				NormHours: TransformTimeToFloat(item.NormHours),
				ValidWhenLastBookingAfter: lastCalculation,
				SysDayScheduleId: parentId
			}
		})
		context.dispatch('removeBreaks', arr)
		copy1 = copy1.filter(c => removed.findIndex(i => c.Id === i.Id) === -1)
	}
	const added = getAddedItems(origin, copy)
	if (added.length > 0) {
		const arr = added.map((item) => {
			return {
				...item,
				NormHours: TransformTimeToFloat(item.NormHours),
				ValidWhenLastBookingAfter: lastCalculation,
				SysDayScheduleId: parentId
			}
		})
		context.dispatch('addBreaks', [...arr])
		copy1.push(...added)
	}
	if (origin1.length === 5 && copy[0] && copy[0].ValidWhenLastBookingAfter !== lastCalculation) {
		origin1.forEach(i => { i.ValidWhenLastBookingAfter = lastCalculation })
	}
	let changes = getCopy(getChanges(copy1.sort((a, b) => a.Id - b.Id), origin1.sort((a, b) => a.Id - b.Id)))
	if (changes.length > 0) {
		context.dispatch('editBreaks', changes)
	}
}

const updateRelativeBreaks = (context, parentId, lastCalculationValue, origin, copy) => {
	let origin1 = [...origin]
	let copy1 = [...copy]
	let relativeLastCalculation = lastCalculationValue || '00:00'

	const removed = getRemovedItems(origin, copy)
	if (removed.length > 0) {
		const arr = removed.map((item) => {
			return {
				...item,
				NormHours: TransformTimeToFloat(item.NormHours),
				ValidWhenLastBookingAfter: relativeLastCalculation,
				SysDayScheduleId: parentId
			}
		})
		context.dispatch('removeRelativeBreaks', arr)
		copy1 = copy1.filter(c => removed.findIndex(i => c.Id === i.Id) === -1)
	}
	const added = getAddedItems(origin, copy)
	if (added.length > 0) {
		const arr = added.map((item) => {
			return {
				...item,
				NormHours: TransformTimeToFloat(item.NormHours),
				ValidWhenLastBookingAfter: relativeLastCalculation,
				SysDayScheduleId: parentId
			}
		})
		context.dispatch('addRelativeBreaks', [...arr])
		copy1.push(...added)
	}
	if (origin1.length === 5 && copy[0] && copy[0].ValidWhenLastBookingAfter !== relativeLastCalculation) {
		origin1.forEach(i => { i.ValidWhenLastBookingAfter = relativeLastCalculation })
	}
	let changes = getCopy(getChanges(copy1.sort((a, b) => a.Id - b.Id), origin1.sort((a, b) => a.Id - b.Id)))
	if (changes.length > 0) {
		context.dispatch('editRelativeBreaks', changes)
	}
}

const updateCalculationRules = (context, origin, copy) => {
	let removePromises = []
	let addPromises = []
	for (let i = 0; i < 3; i++) { // day types length === 3
		const removed = getRemovedItems(origin['Type' + i], copy['Type' + i], 'CalculationId')
		if (removed.length > 0) {
			removePromises.push(context.dispatch('removeCalculationRules', removed))
		}
		Promise.all([ // for sync requests
			...removePromises
		]).then(() => {
			const added = getAddedItems(origin['Type' + i], copy['Type' + i], 'CalculationId')
			if (added.length > 0) {
				addPromises.push(context.dispatch('addCalculationRules', added))
			}
			Promise.all([
				...addPromises
			]).then(() => {
				let itemsForUpdate = false
				origin['Type' + i].forEach((item, index) => {
					if (item.Id !== index + 1) {
						item.Id = index + 1
						itemsForUpdate = true
					}
				})
				if (itemsForUpdate) {
					context.dispatch('editCalculationRule', origin['Type' + i])
				}
			})
		})
	}
}

const updateOvertime = (context, parentId, origin, copy) => {
	let origin1 = [...origin]
	let copy1 = [...copy]

	const removed = getRemovedItems(origin, copy)
	if (removed.length > 0) {
		context.dispatch('removeOvertime', removed)
		copy1 = copy1.filter(c => removed.findIndex(i => c.Id === i.Id) === -1)
	}
	const added = getAddedItems(origin, copy)
	if (added.length > 0) {
		context.dispatch('addOvertime', { ParentId: parentId, Data: added })
		copy1.push(...added)
	}
	let changes = getCopy(getChanges(copy1.sort((a, b) => a.Id - b.Id), origin1.sort((a, b) => a.Id - b.Id)))
	if (changes.length > 0) {
		context.dispatch('editOvertime', changes)
	}
}

const updateSwitches = (context, origin, copy) => {
	let origin1 = [...origin]
	let copy1 = [...copy]
	const removed = getRemovedItems(origin, copy)
	if (removed.length > 0) {
		context.dispatch('removeSwitches', removed)
		copy1 = copy1.filter(c => removed.findIndex(i => c.Id === i.Id) === -1)
	}
	const added = getAddedItems(origin, copy)
	if (added.length > 0) {
		context.dispatch('addSwitches', added)
		copy1.push(...added)
	}
	let changes = getCopy(getChanges(copy1.sort((a, b) => a.Id - b.Id), origin1.sort((a, b) => a.Id - b.Id)))
	if (changes.length > 0) {
		context.dispatch('editSwitches', changes)
	}
}

const validateModel = (url, body) => {
	return new Promise((resolve, reject) => {
		http.call(getMethod(url), body, res => {
			resolve(res)
		}, err => {
			reject(err.response)
		})
	})
}
