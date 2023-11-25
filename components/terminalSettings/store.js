/* global keyValueMapper */

import store from '@/store'
import http from '@/plugins/http'
import { sysTerminal,
	sysTerminalButton,
	sysTerminalTMCSetting,
	sysTerminalCrosspointSetting,
	sysTerminalStatus,
	enumTerminalType,
	enumTerminalDriver,
	enumTerminalAccessBooking,
	enumTerminalTimeBooking,
	enumTerminalComport,
	enumTerminalAccessSetting,
	enumTerminalWhitelistSetting,
	enumTerminalDoorMonitoring,
	sysCostCenter
} from '@/app/api'

let getMethod = store.getters['app/apiMethod']

const state = {
	terminalList: [],
	terminalDetails: null,

	terminalCrosspointSettingList: [],
	terminalTMCSettingList: [],
	terminalStatusList: [],

	terminalTypeKeyValues: [],
	terminalDriverKeyValues: [],
	terminalAccessBookingKeyValues: [],
	terminalTimeBookingKeyValues: [],
	terminalComPortKeyValues: [],
	terminalAccessSettingKeyValues: [],
	terminalWhitelistSettingKeyValues: [],
	terminalDoorMonitoringKeyValues: [],
	sysCostCenterKeyValues: [],

	modelTranslations: [],
	buttonKeyValues: []
}

const crosspointIds = [1, 3]
const virtualIds = [2]
const tmcIds = [0]
const notMaintanance = ['CustomerId', 'Id', 'Description', 'ButtonAdd', 'ButtonChange', 'ButtonDelete', 'ButtonOpenDoor', 'ButtonCloseDoor', 'ButtonBlockDoor']

const isDriverVirtual = driverId => {
	var id = virtualIds.find(vId => vId.toString() === driverId.toString())
	if (id !== undefined) {
		return true
	} else return false
}
const isDriverTMC = driverId => {
	var id = tmcIds.find(tmcId => tmcId.toString() === driverId.toString())
	if (id !== undefined) {
		return true
	} else return false
}
const isDriverCrosspoint = driverId => {
	var id = crosspointIds.find(cId => cId.toString() === driverId.toString())
	if (id !== undefined) {
		return true
	} else return false
}

const actions = {
	getModelTranslations (context) {
		return http.call(getMethod(sysTerminal.getModelTranslation), null, result => {
			context.commit('setModelTranslations', result)
		})
	},
	getButtonKeyValues (context) {
		return http.call(getMethod(sysTerminalButton.getModelTranslation), null, result => {
			context.commit('setButtonKeyValues', result)
		})
	},
	getTerminalList (context) {
		return http.call(getMethod(sysTerminal.getList), null, result => {
			context.commit('setTerminalList', result)
		})
	},
	getTerminalDetails (context, id) {
		let resolveDelegate = null
		http.call(getMethod(sysTerminal.getDetails), {id}, result => {
			let mapResult = {
				Id: result.Id,
				Description: result.Description,
				DriverId: result.DriverId,
				TypeId: result.TypeId,
				AccessBookingId: result.AccessBookingId,
				TimeBookingId: result.TimeBookingId,
				Parameter: result.Parameter,
				RingId: result.RingId,
				SerialNumber: result.SerialNumber,
				SequenceNumber: result.SequenceNumber,
				CVENumber: result.CVENumber,
				SysTerminalCrosspointSetting: result.SysTerminalCrosspointSetting || {},
				SysTerminalStatus: result.SysTerminalStatus || {},
				SysTerminalTMCSetting: result.SysTerminalTMCSetting || {}
			}
			if (resolveDelegate) {
				resolveDelegate(mapResult)
			}
		})
		return new Promise(resolve => {
			resolveDelegate = resolve
		})
	},
	getTerminalButtons (context, id) {
		let resolveDelegate = null
		http.call(getMethod(sysTerminalButton.getDetails), {id}, result => {
			let mapResult = {
				Id: result.Id,
				Description: result.Description,
				ButtonAdd: result.ButtonAdd,
				ButtonChange: result.ButtonChange,
				ButtonDelete: result.ButtonDelete,
				ButtonInitialize: result.ButtonInitialize,
				ButtonGetBookings: result.ButtonGetBookings,
				ButtonReset: result.ButtonReset,
				ButtonOpenDoor: result.ButtonOpenDoor,
				ButtonCloseDoor: result.ButtonCloseDoor,
				ButtonBlockDoor: result.ButtonBlockDoor,
				ButtonReadFingerprints: result.ButtonReadFingerprints,
				ButtonWriteFingerprints: result.ButtonWriteFingerprints,
				ButtonRefresh: result.ButtonRefresh,
				ButtonSynchronize: result.ButtonSynchronize
			}
			if (resolveDelegate) {
				resolveDelegate(mapResult)
			}
		})
		return new Promise(resolve => {
			resolveDelegate = resolve
		})
	},
	getTerminalCrosspointSettingList (context) {
		return http.call(getMethod(sysTerminalCrosspointSetting.getList), null, result => {
			context.commit('setTerminalCrosspointSettingList', result)
		})
	},
	getTerminalTMCSettingList (context) {
		return http.call(getMethod(sysTerminalTMCSetting.getList), null, result => {
			context.commit('setTerminalTMCSettingList', result)
		})
	},
	getTerminalStatusList (context) {
		return http.call(getMethod(sysTerminalStatus.getList), null, result => {
			context.commit('setTerminalStatusList', result)
		})
	},
	getTerminalTypeKeyValues (context) {
		return http.call(getMethod(enumTerminalType.getKeyValues), null, result => {
			context.commit('setTerminalTypeKeyValues', result)
		})
	},
	getTerminalDriverKeyValues (context) {
		return http.call(getMethod(enumTerminalDriver.getKeyValues), null, result => {
			context.commit('setTerminalDriverKeyValues', result)
		})
	},
	getTerminalAccessBookingKeyValues (context) {
		return http.call(getMethod(enumTerminalAccessBooking.getKeyValues), null, result => {
			context.commit('setTerminalAccessBookingKeyValues', result)
		})
	},
	getTerminalTimeBookingKeyValues (context) {
		return http.call(getMethod(enumTerminalTimeBooking.getKeyValues), null, result => {
			context.commit('setTerminalTimeBookingKeyValues', result)
		})
	},
	getTerminalComPortKeyValues (context) {
		return http.call(getMethod(enumTerminalComport.getKeyValues), null, result => {
			context.commit('setTerminalComPortKeyValues', result)
		})
	},
	getTerminalAccessSettingKeyValues (context) {
		return http.call(getMethod(enumTerminalAccessSetting.getKeyValues), null, result => {
			context.commit('setTerminalAccessSettingKeyValues', result)
		})
	},
	getTerminalWhitelistSettingKeyValues (context) {
		return http.call(getMethod(enumTerminalWhitelistSetting.getKeyValues), null, result => {
			context.commit('setTerminalWhitelistSettingKeyValues', result)
		})
	},
	getTerminalDoorMonitoringKeyValues (context) {
		return http.call(getMethod(enumTerminalDoorMonitoring.getKeyValues), null, result => {
			context.commit('setTerminalDoorMonitoringKeyValues', result)
		})
	},
	getSysCostCenterKeyValues (context) {
		return http.call(getMethod(sysCostCenter.getKeyValues), null, result => {
			context.commit('setSysCostCenterKeyValues', result)
		})
	},

	addTerminal (context, payload) {
		var comPort = 0
		var address = 0
		if (isDriverTMC(payload.DriverId)) {
			comPort = 0
			address = payload.SysTerminalTMCSetting.Address
		} else if (isDriverCrosspoint(payload.DriverId)) {
			comPort = payload.SysTerminalCrosspointSetting.ComPortId
			address = payload.SysTerminalCrosspointSetting.Address
		}
		let body = {
			Id: 0,
			Description: payload.Description,
			DriverId: payload.DriverId,
			TypeId: payload.TypeId,
			AccessBookingId: payload.AccessBookingId,
			TimeBookingId: payload.TimeBookingId,
			Parameter: payload.Parameter,
			RingId: payload.RingId,
			SerialNumber: payload.SerialNumber,
			SequenceNumber: payload.SequenceNumber,
			CVENumber: payload.CVENumber,
			ComPortId: comPort,
			Address: address,
			CustomerId: 0,
			ModifiedOn: moment().utc().format('YYYY-MM-DD HH:mm:ss')
		}
		return http.call(getMethod(sysTerminal.add), body, result => {
			let mapResult
			if (isDriverVirtual(payload.DriverId)) {
				mapResult = {
					Id: result.Id,
					TerminalName: result.Description,
					TerminalType: context.state.terminalTypeKeyValues.find(el => el.Key === result.TypeId.toString()).Value,
					TerminalStatus: ''
				}
			} else {
				mapResult = {
					Id: result.Id,
					TerminalName: result.Description,
					TerminalType: context.state.terminalTypeKeyValues.find(el => el.Key === result.TypeId.toString()).Value,
					TerminalStatus: payload.SysTerminalStatus.Status
				}
			}
			context.commit('addTerminal', mapResult)
			if (isDriverCrosspoint(payload.DriverId)) {
				let bodyCrosspoint = {
					CustomerId: 0,
					SysTerminalId: result.Id,
					ComPortId: comPort,
					Address: address
				}
				http.call(getMethod(sysTerminalCrosspointSetting.add), bodyCrosspoint)
				let bodyStatus = {
					CustomerId: 0,
					SysTerminalId: result.Id,
					LastSynchronisationOn: payload.LastSynchronisationOn,
					DoorSettingId: payload.DoorSettingId,
					DoorStatusId: payload.DoorStatusId,
					LastDoorStatusOn: payload.LastDoorStatusOn
				}
				http.call(getMethod(sysTerminalStatus.add), bodyStatus)
			}
			if (isDriverTMC(payload.DriverId)) {
				let bodyTMC = {
					CustomerId: 0,
					SysTerminalId: result.Id,
					Address: payload.SysTerminalTMCSetting.Address,
					IPAddress: payload.SysTerminalTMCSetting.IPAddress,
					DoorOpenTimeForAll: payload.SysTerminalTMCSetting.DoorOpenTimeForAll,
					DoorOpenTimeForEntry: payload.SysTerminalTMCSetting.DoorOpenTimeForAll,
					DoorOpenTimeForExit: payload.SysTerminalTMCSetting.DoorOpenTimeForAll,
					DoorOpenTimeForFunctionKey: payload.SysTerminalTMCSetting.DoorOpenTimeForAll,
					DoorOpenTimeForInfoKey: payload.SysTerminalTMCSetting.DoorOpenTimeForAll,
					OnLineSetting: payload.SysTerminalTMCSetting.OnLineSetting,
					CostCenterIn: payload.SysTerminalTMCSetting.CostCenterIn,
					CostCenterOut: payload.SysTerminalTMCSetting.CostCenterOut,
					AccessSettingId: payload.SysTerminalTMCSetting.AccessSettingId,
					WhitelistSettingId: payload.SysTerminalTMCSetting.WhitelistSettingId,
					DoorMonitoringId: payload.SysTerminalTMCSetting.DoorMonitoringId,
					PassBackInterval: payload.SysTerminalTMCSetting.PassBackInterval,
					DoorMonitoringTimeout: payload.SysTerminalTMCSetting.DoorMonitoringTimeout
				}
				http.call(getMethod(sysTerminalTMCSetting.add), bodyTMC)
			}
		})
	},
	editTerminal (context, payload) {
		let body = {
			Id: payload.Id,
			Description: payload.Description,
			DriverId: payload.DriverId,
			TypeId: payload.TypeId,
			AccessBookingId: payload.AccessBookingId,
			TimeBookingId: payload.TimeBookingId,
			Parameter: payload.Parameter,
			RingId: payload.RingId,
			SerialNumber: payload.SerialNumber,
			SequenceNumber: payload.SequenceNumber,
			CVENumber: payload.CVENumber,
			Address: payload.SysTerminalTMCSetting.Address,
			CustomerId: 0,
			ModifiedOn: moment().utc().format('YYYY-MM-DD HH:mm:ss')
		}
		return http.call(getMethod(sysTerminal.edit), body, result => {
			var statusTerminal = ''
			if (isDriverCrosspoint(payload.DriverId)) {
				statusTerminal = payload.SysTerminalStatus.Status
			}
			let newTerminalBody = {
				Id: payload.Id,
				TerminalName: payload.Description,
				TerminalType: state.terminalTypeKeyValues.find(el => el.Key === payload.TypeId.toString()).Value,
				TerminalStatus: statusTerminal
			}
			context.commit('editTerminal', newTerminalBody)
			if (isDriverCrosspoint(payload.DriverId)) {
				let bodyCrosspoint = {
					CustomerId: 0,
					SysTerminalId: payload.Id,
					ComPortId: payload.SysTerminalCrosspointSetting.ComPortId,
					Address: payload.SysTerminalCrosspointSetting.Address
				}
				http.call(getMethod(sysTerminalCrosspointSetting.edit), bodyCrosspoint)
				let bodyStatus = {
					CustomerId: 0,
					SysTerminalId: payload.Id,
					LastSynchronisationOn: payload.LastSynchronisationOn,
					DoorSettingId: payload.DoorSettingId,
					DoorStatusId: payload.DoorStatusId,
					LastDoorStatusOn: payload.LastDoorStatusOn
				}
				http.call(getMethod(sysTerminalStatus.edit), bodyStatus)
			}
			if (isDriverTMC(payload.DriverId)) {
				let bodyTMC = {
					CustomerId: 0,
					SysTerminalId: payload.Id,
					Address: payload.SysTerminalTMCSetting.Address,
					IPAddress: payload.SysTerminalTMCSetting.IPAddress,
					DoorOpenTimeForAll: payload.SysTerminalTMCSetting.DoorOpenTimeForAll,
					DoorOpenTimeForEntry: payload.SysTerminalTMCSetting.DoorOpenTimeForAll,
					DoorOpenTimeForExit: payload.SysTerminalTMCSetting.DoorOpenTimeForAll,
					DoorOpenTimeForFunctionKey: payload.SysTerminalTMCSetting.DoorOpenTimeForAll,
					DoorOpenTimeForInfoKey: payload.SysTerminalTMCSetting.DoorOpenTimeForAll,
					OnLineSetting: payload.SysTerminalTMCSetting.OnLineSetting,
					CostCenterIn: payload.SysTerminalTMCSetting.CostCenterIn,
					CostCenterOut: payload.SysTerminalTMCSetting.CostCenterOut,
					AccessSettingId: payload.SysTerminalTMCSetting.AccessSettingId,
					WhitelistSettingId: payload.SysTerminalTMCSetting.WhitelistSettingId,
					DoorMonitoringId: payload.SysTerminalTMCSetting.DoorMonitoringId,
					PassBackInterval: payload.SysTerminalTMCSetting.PassBackInterval,
					DoorMonitoringTimeout: payload.SysTerminalTMCSetting.DoorMonitoringTimeout
				}
				http.call(getMethod(sysTerminalTMCSetting.edit), bodyTMC)
			}
		})
	},
	removeTerminal (context, payload) {
		return http.call(getMethod(sysTerminal.remove), payload, result => {
			context.commit('removeTerminal', result)
		})
	}
}

const getters = {
	terminalList: state => searchFilter => {
		let result = state.terminalList

		if (searchFilter) {
			const sf = searchFilter.toLowerCase()
			result = result.filter(i =>
				(i.TerminalName && i.TerminalName.toLowerCase().search(sf) !== -1) ||
				(i.TerminalType && i.TerminalType.toLowerCase().search(sf) !== -1) ||
				(i.TerminalStatus && i.TerminalStatus.toLowerCase().search(sf) !== -1)
			)
		}

		return result.map(item => {
			return {
				Id: item.Id,
				TerminalName: item.TerminalName,
				TerminalType: item.TerminalType,
				TerminalStatus: item.TerminalStatus
			}
		})
	},

	terminalTypeKeyValues: state => state.terminalTypeKeyValues.map(keyValueMapper),
	terminalDriverKeyValues: state => state.terminalDriverKeyValues.map(keyValueMapper),
	terminalAccessBookingKeyValues: state => state.terminalAccessBookingKeyValues.map(keyValueMapper),
	terminalTimeBookingKeyValues: state => state.terminalTimeBookingKeyValues.map(keyValueMapper),
	terminalComPortKeyValues: state => state.terminalComPortKeyValues.map(keyValueMapper),

	terminalAccessSettingKeyValues: state => state.terminalAccessSettingKeyValues.map(keyValueMapper),
	terminalWhitelistSettingKeyValues: state => state.terminalWhitelistSettingKeyValues.map(keyValueMapper),
	terminalDoorMonitoringKeyValues: state => state.terminalDoorMonitoringKeyValues.map(keyValueMapper),
	sysCostCenterKeyValues: state => state.sysCostCenterKeyValues.map(keyValueMapper),

	terminalCrosspointSettingList: state => {
		let list = state.terminalCrosspointSettingList.map(keyValueMapper)
		list.unshift({ label: '', value: null })
		return list
	},
	terminalTMCSettingList: state => {
		let list = state.terminalTMCSettingList.map(keyValueMapper)
		list.unshift({ label: '', value: null })
		return list
	},
	terminalStatusList: state => {
		let list = state.terminalStatus.map(keyValueMapper)
		list.unshift({ label: '', value: null })
		return list
	},
	modelTranslation: state => key => {
		let translation = state.modelTranslations.find(lt => lt.Key === key)
		return translation ? translation.Value : ''
	},
	buttonKeyValues: state => state.buttonKeyValues.map(keyValueMapper)
}

const mutations = {
	setModelTranslations (state, translations) {
		state.modelTranslations = translations
	},

	setButtonKeyValues (state, keyValues) {
		state.buttonKeyValues = []
		keyValues.forEach(kv => {
			if (notMaintanance.find(key => kv.Key === key) === undefined) {
				state.buttonKeyValues.push(kv)
			}
		})
	},

	setTerminalList (state, list) {
		state.terminalList = list
	},

	setTerminalDetails (state, obj) {
		state.terminalDetails = obj
	},

	setTerminalCrosspointSettingList (state, list) {
		state.terminalCrosspointSettingList = list
	},

	setTerminalTMCSettingList (state, list) {
		state.terminalTMCSettingList = list
	},

	setTerminalStatusList (state, list) {
		state.terminalStatusList = list
	},

	setTerminalTypeKeyValues (state, keyValues) {
		state.terminalTypeKeyValues = keyValues
	},
	setTerminalDriverKeyValues (state, keyValues) {
		state.terminalDriverKeyValues = keyValues
	},
	setTerminalAccessBookingKeyValues (state, keyValues) {
		state.terminalAccessBookingKeyValues = keyValues
	},
	setTerminalTimeBookingKeyValues (state, keyValues) {
		state.terminalTimeBookingKeyValues = keyValues
	},
	setTerminalComPortKeyValues (state, keyValues) {
		state.terminalComPortKeyValues = keyValues
	},

	setTerminalAccessSettingKeyValues (state, keyValues) {
		state.terminalAccessSettingKeyValues = keyValues
	},
	setTerminalWhitelistSettingKeyValues (state, keyValues) {
		state.terminalWhitelistSettingKeyValues = keyValues
	},
	setTerminalDoorMonitoringKeyValues (state, keyValues) {
		state.terminalDoorMonitoringKeyValues = keyValues
	},
	setSysCostCenterKeyValues (state, keyValues) {
		state.sysCostCenterKeyValues = keyValues
	},
	addTerminal (state, terminal) {
		state.terminalList.push(terminal)
	},
	editTerminal (state, terminal) {
		const index = state.terminalList.findIndex(t => t.Id === terminal.Id)
		if (index >= 0) {
			state.terminalList.splice(index, 1, terminal)
		}
	},
	removeTerminal (state, terminal) {
		const index = state.terminalList.findIndex(t => t.Id === terminal.Id)
		if (index >= 0) {
			state.terminalList.splice(index, 1)
		}
	}
}

store.registerModule(['sysadmin', 'systerminal'], {
	namespaced: true,
	state,
	actions,
	getters,
	mutations
})
