<template>
	<sys-base :vm="vm">
		<div slot="sys-form" style="height: 100%; position:fixed;">
			<div class="relative">
				<v-form>
					<v-form-group :label="labelTranslation('Terminal nr') | capitalize">
						<v-input :containerStyle="'width: 30%'" v-model="model.Id" :isEditMode="isChanged" :disabled="!canEdit" name="TerminalNr" :validate="getTerminalValidationRulesFor(sysTerminal, 'Id')"></v-input>
					</v-form-group>
					<v-form-group :label="labelTranslation('Terminal name') | capitalize">
						<v-input v-model="model.Description" name="TerminalName" :isEditMode="isChanged" :disabled="!canEdit" :validate="getTerminalValidationRulesFor(sysTerminal, 'Description')"></v-input>
					</v-form-group>
					<v-form-group :label="labelTranslation('Driver type') | capitalize">
						<v-select v-model="model.DriverId" :isEditMode="isChanged" :options="terminalDriverKeyValues" :disabled="!canEdit" name="DriverType" :validate="getTerminalValidationRulesFor(sysTerminal, 'DriverId')"></v-select>
					</v-form-group>
					<v-form-group :label="labelTranslation('Terminal type') | capitalize">
						<v-select v-model="model.TypeId" :isEditMode="isChanged" :options="terminalTypeKeyValues" :disabled="!canEdit" name="TerminalType" :validate="getTerminalValidationRulesFor(sysTerminal, 'TypeId')"></v-select>
					</v-form-group>
					<tr>
						<td colspan="2"><div class="h-line" style="margin-bottom:15px"></div></td>
					</tr>
				</v-form>
			</div>
			<div class="form-wrapper">
				<v-form>
					<v-form-group :label="labelTranslation('Door control') | capitalize" v-if="!isVirtual">
						<table style="width: 350px;margin-bottom: 0rem;">
							<tr style="border-bottom: hidden;">
								<td>
									<button class="button chip-button blue" id="OpenDoor" :disabled="!canEdit" @click="executeActionButton(model.ButtonOpenDoor, 'ButtonOpenDoor')" :enable="model.ButtonOpenDoor" name="OpenDoor">{{labelTranslation('Open door') | capitalize }}</button>
								</td>
								<td>
									<button class="button chip-button purple" id="CloseDoor" :disabled="!canEdit" @click="executeActionButton(model.ButtonCloseDoor, 'ButtonCloseDoor')" :enable="model.ButtonCloseDoor" name="CloseDoor">{{labelTranslation('Close door') | capitalize }}</button>
								</td>
								<td>
									<button class="button chip-button red" id="BlockDoor" :disabled="!canEdit" @click="executeActionButton(model.ButtonBlockDoor, 'ButtonBlockDoor')" :enable="model.ButtonBlockDoor" name="BlockDoor">{{labelTranslation('Block door') | capitalize }}</button>
								</td>
							</tr>
						</table>
					</v-form-group>
					<v-form-group :label="labelTranslation('CVE number') | capitalize">
						<v-input :containerStyle="'width: 40%'" :isEditMode="isChanged" :disabled="!canEdit" v-model="model.CVENumber" name="CVENumber" :validate="getTerminalValidationRulesFor(sysTerminal, 'CVENumber')"></v-input>
					</v-form-group>
					<v-form-group :label="labelTranslation('COM port') | capitalize" v-if="isCrosspoint">
						<v-select :containerStyle="'width: 40%'" :isEditMode="isChanged" :disabled="!canEdit" v-model="model.SysTerminalCrosspointSetting.ComPortId" :options="terminalComPortKeyValues" name="ComPort"></v-select>
					</v-form-group>
					<v-form-group :label="labelTranslation('Sequence number') | capitalize" v-if="isVirtual || isTMC">
						<v-input :containerStyle="'width: 30%'" :isEditMode="isChanged" :disabled="!canEdit" v-model="model.SequenceNumber" name="SequenceNumber"></v-input>
					</v-form-group>
					<v-form-group :label="labelTranslation('Address') | capitalize" v-if="!isVirtual">
						<v-input v-model="model.SysTerminalTMCSetting.Address" :isEditMode="isChanged" :disabled="!canEdit" name="Address" :validate="getTerminalValidationRulesFor(sysTerminalTMCSetting, 'Address')"></v-input>
					</v-form-group>
					<v-form-group :label="labelTranslation('Parameters') | capitalize">
						<v-input v-model="model.Parameter" name="Parameter" :isEditMode="isChanged" :disabled="!canEdit" :validate="getTerminalValidationRulesFor(sysTerminal, 'Parameter')"></v-input>
					</v-form-group>
					<v-form-group :label="labelTranslation('Entry direction') | capitalize">
						<v-select v-model="model.AccessBookingId" :isEditMode="isChanged" :disabled="!canEdit" :options="terminalAccessBookingKeyValues" :optionsCapitalize="false" name="AccessBooking" :validate="getTerminalValidationRulesFor(sysTerminal, 'AccessBookingId')"></v-select>
					</v-form-group>
					<v-form-group :label="labelTranslation('Time direction') | capitalize">
						<v-select v-model="model.TimeBookingId" :isEditMode="isChanged" :disabled="!canEdit" :options="terminalTimeBookingKeyValues" :optionsCapitalize="false" name="TimeBooking" :validate="getTerminalValidationRulesFor(sysTerminal, 'TimeBookingId')"></v-select>
					</v-form-group>
					<v-form-group :label="labelTranslation('Serial number') | capitalize">
						<v-input v-model="model.SerialNumber" :isEditMode="isChanged" :disabled="!canEdit" name="SerialNumber"></v-input>
					</v-form-group>
					<v-form-group :label="labelTranslation('Ring ID') | capitalize">
						<v-input :containerStyle="'width: 30%'" :isEditMode="isChanged" :disabled="!canEdit" v-model="model.RingId" name="RingId" :validate="getTerminalValidationRulesFor(sysTerminal, 'RingId')"></v-input>
					</v-form-group>

					<v-form-group :label="labelTranslation('Maintenance') | capitalize" v-if="!isVirtual">
						<v-select :containerStyle="'width: 40%'" v-model="buttonAction" :disabled="!canEdit" :options="buttons" name="Maintenance" :isEditMode="isChanged"></v-select>
						<i @click="executeAction" class="fa fa-arrow-circle-o-right cursor-pointer arrowStyle" style="width: 20px;margin-left:5px;" aria-hidden="true" v-if="buttonAction !== ''"></i>
					</v-form-group>
					<v-form-group :label="labelTranslation('Entry release') | capitalize" v-if="isTMC">
						<v-select v-model="model.SysTerminalTMCSetting.AccessSettingId" :disabled="!canEdit" :isEditMode="isChanged" :options="terminalAccessSettingKeyValues" name="AccessSetting" :validate="getTerminalValidationRulesFor(sysTerminalTMCSetting, 'AccessSettingId')"></v-select>
					</v-form-group>
					<v-form-group :label="labelTranslation('IP address') | capitalize" v-if="isTMC">
						<v-input v-model="model.SysTerminalTMCSetting.IPAddress" :disabled="!canEdit" :isEditMode="isChanged" name="IPAddress" :validate="getTerminalValidationRulesFor(sysTerminalTMCSetting, 'IPAddress')"></v-input>
					</v-form-group>
					<v-form-group :label="labelTranslation('Whitelist') | capitalize" v-if="isTMC">
						<v-select v-model="model.SysTerminalTMCSetting.WhitelistSettingId" :disabled="!canEdit" :isEditMode="isChanged" :options="terminalWhitelistSettingKeyValues" name="Whitelist" :validate="getTerminalValidationRulesFor(sysTerminalTMCSetting, 'WhitelistSettingId')"></v-select>
					</v-form-group>
					<v-form-group :label="labelTranslation('Repeat window') | capitalize" v-if="isTMC">
						<v-input :styleClass="'width: 30%'" :isEditMode="isChanged" :disabled="!canEdit" v-model="model.SysTerminalTMCSetting.PassBackInterval" name="PassBackInterval" :validate="getTerminalValidationRulesFor('PassBackInterval')"></v-input>
					</v-form-group>
					<v-form-group :label="labelTranslation('Callback contacts') | capitalize" v-if="isTMC">
						<v-select v-model="model.SysTerminalTMCSetting.DoorMonitoringId" :disabled="!canEdit" :isEditMode="isChanged" :options="terminalDoorMonitoringKeyValues" name="DoorMonitoring" :validate="getTerminalValidationRulesFor(sysTerminalTMCSetting, 'DoorMonitoringId')"></v-select>
					</v-form-group>
					<v-form-group :label="labelTranslation('Timeout if late') | capitalize" v-if="isTMC">
						<v-input :styleClass="'width: 30%'" :isEditMode="isChanged" :disabled="!canEdit" v-model="model.SysTerminalTMCSetting.DoorMonitoringTimeout" name="DoorMonitoringTimeout" :validate="getTerminalValidationRulesFor(sysTerminalTMCSetting, 'DoorMonitoringTimeout')"></v-input>
					</v-form-group>
					<v-form-group :label="labelTranslation('Relais time') | capitalize" v-if="isTMC">
						<v-input :styleClass="'width: 30%'" :isEditMode="isChanged" :disabled="!canEdit" v-model="model.SysTerminalTMCSetting.DoorOpenTimeForAll" name="DoorOpenTimeForAll" :validate="getTerminalValidationRulesFor(sysTerminalTMCSetting, 'DoorOpenTimeForAll')"></v-input>
					</v-form-group>
					<v-form-group :label="labelTranslation('Connection') | capitalize" v-if="isTMC">
						<v-checkbox id="Connection" :isEditMode="isChanged" :disabled="!canEdit" v-model="model.SysTerminalTMCSetting.OnLineSetting" name="Connection" :validate="getTerminalValidationRulesFor(sysTerminalTMCSetting, 'OnLineSetting')"></v-checkbox>
					</v-form-group>
					<v-form-group :label="labelTranslation('Costcenter in') | capitalize" v-if="isTMC">
						<v-select v-model="model.SysTerminalTMCSetting.CostCenterIn" :disabled="!canEdit" :isEditMode="isChanged" :options="sysCostCenterKeyValues" name="CostCenterIn" :validate="getTerminalValidationRulesFor(sysTerminalTMCSetting, 'CostCenterIn')"></v-select>
					</v-form-group>
					<v-form-group :label="labelTranslation('Costcenter out') | capitalize" v-if="isTMC">
						<v-select v-model="model.SysTerminalTMCSetting.CostCenterOut" :disabled="!canEdit" :isEditMode="isChanged" :options="sysCostCenterKeyValues" name="CallbackContact" :validate="getTerminalValidationRulesFor(sysTerminalTMCSetting, 'CostCenterOut')"></v-select>
					</v-form-group>
				</v-form>
			</div>
		</div>
	</sys-base>
</template>

<script>
/* global valueEquals */
import '../../../store/terminal'
import validate from '@/plugins/validate'
import http from '@/plugins/http'
import SysBase from '../../SysBase'
import BaseMixin from '../../BaseMixin'
import { mapActions, mapGetters } from 'vuex'
import { sysTerminal,
	sysTerminalTMCSetting,
	sysTerminalCrosspointSetting
} from '@/app/api'

export default {
	mixins: [
		BaseMixin
	],
	components: {
		SysBase
	},
	constants: {
		entityName: 'Terminal',
		tableApiHelperPath: sysTerminal.getDetails,
		formApiHelperPath: sysTerminal.getDetails,
		sysMenuItemPath: '4',
		tableColumns () {
			return [
				{ key: 'TerminalName' },
				{ key: 'TerminalType' },
				{ key: 'TerminalStatus', headerKey: 'TerminalStatus' }
			]
		},
		defaultModel: {
			SysTerminalCrosspointSetting: {
				EnumTerminalComPort: {
					Id: 0,
					Description: 'COM0'
				},
				SysTerminalId: null,
				ComPortId: 0,
				Address: 0
			},
			SysTerminalTMCSetting: {
				SysTerminalId: null,
				Address: '',
				AccessSettingId: null,
				IPAddress: '',
				OnLineSetting: null,
				CostCenterIn: '',
				CostCenterOut: '',
				WhitelistSettingId: null,
				PassBackInterval: null
			},
			SysTerminalStatus: {
				SysTerminalId: null,
				Status: ''
			},
			EnumTerminalAccessBooking: {
				Id: 0
			},
			EnumTerminalDriver: {
				Id: 0
			},
			EnumTerminalTimeBooking: {
				Id: 0
			},
			EnumTerminalType: {
				Id: 0
			},
			DriverId: 0,
			TypeId: 0
		}
	},
	computed: {
		...mapGetters('sysadmin/systerminal', {
			tableData: 'terminalList',
			modelTranslation: 'modelTranslation',
			terminalTypeKeyValues: 'terminalTypeKeyValues',
			terminalDriverKeyValues: 'terminalDriverKeyValues',
			terminalAccessBookingKeyValues: 'terminalAccessBookingKeyValues',
			terminalTimeBookingKeyValues: 'terminalTimeBookingKeyValues',
			terminalComPortKeyValues: 'terminalComPortKeyValues',

			terminalAccessSettingKeyValues: 'terminalAccessSettingKeyValues',
			terminalWhitelistSettingKeyValues: 'terminalWhitelistSettingKeyValues',
			terminalDoorMonitoringKeyValues: 'terminalDoorMonitoringKeyValues',
			sysCostCenterKeyValues: 'sysCostCenterKeyValues',

			buttonKeyValues: 'buttonKeyValues'
		}),
		driverId: function () {
			return this.model.DriverId
		},

		modelsEqual: function () {
			return valueEquals(this.model.Id, this.modelCopy.Id) &&
				valueEquals(this.model.Description, this.modelCopy.Description) &&
				valueEquals(this.model.DriverId, this.modelCopy.DriverId) &&
				valueEquals(this.model.TypeId, this.modelCopy.TypeId) &&
				valueEquals(this.model.CVENumber, this.modelCopy.CVENumber) &&
				valueEquals(this.model.SysTerminalCrosspointSetting.ComPortId, this.modelCopy.SysTerminalCrosspointSetting.ComPortId) &&
				valueEquals(this.model.SequenceNumber, this.modelCopy.SequenceNumber) &&
				valueEquals(this.model.SysTerminalTMCSetting.Address, this.modelCopy.SysTerminalTMCSetting.Address) &&
				valueEquals(this.model.Parameter, this.modelCopy.Parameter) &&
				valueEquals(this.model.AccessBookingId, this.modelCopy.AccessBookingId) &&
				valueEquals(this.model.TimeBookingId, this.modelCopy.TimeBookingId) &&
				valueEquals(this.model.SerialNumber, this.modelCopy.SerialNumber) &&
				valueEquals(this.model.RingId, this.modelCopy.RingId) &&
				valueEquals(this.model.SysTerminalTMCSetting.AccessSettingId, this.modelCopy.SysTerminalTMCSetting.AccessSettingId) &&
				valueEquals(this.model.SysTerminalTMCSetting.IPAddress, this.modelCopy.SysTerminalTMCSetting.IPAddress) &&
				valueEquals(this.model.SysTerminalTMCSetting.WhitelistSettingId, this.modelCopy.SysTerminalTMCSetting.WhitelistSettingId) &&
				valueEquals(this.model.SysTerminalTMCSetting.PassBackInterval, this.modelCopy.SysTerminalTMCSetting.PassBackInterval) &&
				valueEquals(this.model.SysTerminalTMCSetting.DoorMonitoringId, this.modelCopy.SysTerminalTMCSetting.DoorMonitoringId) &&
				valueEquals(this.model.SysTerminalTMCSetting.DoorMonitoringTimeout, this.modelCopy.SysTerminalTMCSetting.DoorMonitoringTimeout) &&
				valueEquals(this.model.SysTerminalTMCSetting.DoorOpenTimeForAll, this.modelCopy.SysTerminalTMCSetting.DoorOpenTimeForAll) &&
				valueEquals(this.model.SysTerminalTMCSetting.OnLineSetting, this.modelCopy.SysTerminalTMCSetting.OnLineSetting) &&
				valueEquals(this.model.SysTerminalTMCSetting.CostCenterIn, this.modelCopy.SysTerminalTMCSetting.CostCenterIn) &&
				valueEquals(this.model.SysTerminalTMCSetting.CostCenterOut, this.modelCopy.SysTerminalTMCSetting.CostCenterOut)
		},
		isDriverVirtual () {
			var id = this.virtualIds.find(id => id === this.model.DriverId)
			if (id !== undefined) {
				return true
			} else return false
		},
		isDriverTMC () {
			var id = this.tmcIds.find(id => id === this.model.DriverId)
			if (id !== undefined) {
				return true
			} else return false
		},
		isDriverCrosspoint () {
			var id = this.crosspointIds.find(id => id === this.model.DriverId)
			if (id !== undefined) {
				return true
			} else return false
		},
	},
	watch: {
		driverId (val) {
			var strVal = val.toString()
			var id1 = this.tmcIds.find(id => id.toString() === strVal)
			var id2 = this.virtualIds.find(id => id.toString() === strVal)
			var id3 = this.crosspointIds.find(id => id.toString() === strVal)
			if (id1 !== undefined) {
				this.isCrosspoint = false
				this.isTMC = true
				this.isVirtual = false
			} else if (id2 !== undefined) {
				this.isCrosspoint = false
				this.isTMC = false
				this.isVirtual = true
			} else if (id3 !== undefined) {
				this.isCrosspoint = true
				this.isTMC = false
				this.isVirtual = false
			}
		}
	},
	data () {
		return {
			buttonAction: '',

			isCrosspoint: false,
			isTMC: true,
			isVirtual: false,

			crosspointIds: [1, 3],
			virtualIds: [2],
			tmcIds: [0],

			buttons: []
		}
	},
	methods: {

		...mapActions('sysadmin/systerminal', {
			getList: 'getTerminalList',
			getTerminalCrosspointSettingList: 'getTerminalCrosspointSettingList',
			getTerminalTMCSettingList: 'getTerminalTMCSettingList',
			getTerminalStatusList: 'getTerminalStatusList',
			getTerminalDetails: 'getTerminalDetails',
			getTerminalButtons: 'getTerminalButtons',

			add: 'addTerminal',
			save: 'editTerminal',
			delete: 'removeTerminal',

			getTerminalTypeKeyValues: 'getTerminalTypeKeyValues',
			getTerminalDriverKeyValues: 'getTerminalDriverKeyValues',
			getTerminalAccessBookingKeyValues: 'getTerminalAccessBookingKeyValues',
			getTerminalTimeBookingKeyValues: 'getTerminalTimeBookingKeyValues',
			getTerminalComPortKeyValues: 'getTerminalComPortKeyValues',

			getTerminalAccessSettingKeyValues: 'getTerminalAccessSettingKeyValues',
			getTerminalWhitelistSettingKeyValues: 'getTerminalWhitelistSettingKeyValues',
			getTerminalDoorMonitoringKeyValues: 'getTerminalDoorMonitoringKeyValues',
			getSysCostCenterKeyValues: 'getSysCostCenterKeyValues',

			getModelTranslations: 'getModelTranslations',
			getButtonKeyValues: 'getButtonKeyValues'
		}),
		getDetails (obj) {
			this.buttonAction = ''
			if (!obj) {
				return
			}
			let resolveDelegate = null
			let terminalDetails, terminalButtons
			http.waitAll([
				this.getTerminalDetails(obj.Id).then(result => {
					terminalDetails = result
				}),
				this.getTerminalButtons(obj.Id).then(result => {
					terminalButtons = result						
					let buttonsWithOne = Object.keys(result).filter(key => key.startsWith('Button') && result[key] === 1)
						this.buttons = this.buttonKeyValues.filter(kv => buttonsWithOne.find(v => kv.value === v) !== undefined)
					})
				]).then(() => {
					if (resolveDelegate) {
						resolveDelegate({
							Id: terminalDetails.Id,
							Description: terminalDetails.Description,
							DriverId: terminalDetails.DriverId,
							TypeId: terminalDetails.TypeId,
							AccessBookingId: terminalDetails.AccessBookingId,
							TimeBookingId: terminalDetails.TimeBookingId,
							Parameter: terminalDetails.Parameter,
							RingId: terminalDetails.RingId,
							SerialNumber: terminalDetails.SerialNumber,
							SequenceNumber: terminalDetails.SequenceNumber,
							CVENumber: terminalDetails.CVENumber,
							SysTerminalCrosspointSetting: terminalDetails.SysTerminalCrosspointSetting || {},
							SysTerminalStatus: terminalDetails.SysTerminalStatus || {},
							SysTerminalTMCSetting: terminalDetails.SysTerminalTMCSetting || {},
							ButtonId: terminalButtons.Id,
							ButtonDescription: terminalButtons.Description,
							ButtonAdd: terminalButtons.ButtonAdd,
							ButtonChange: terminalButtons.ButtonChange,
							ButtonDelete: terminalButtons.ButtonDelete,
							ButtonInitialize: terminalButtons.ButtonInitialize,
							ButtonGetBookings: terminalButtons.ButtonGetBookings,
							ButtonReset: terminalButtons.ButtonReset,
							ButtonOpenDoor: terminalButtons.ButtonOpenDoor,
							ButtonCloseDoor: terminalButtons.ButtonCloseDoor,
							ButtonBlockDoor: terminalButtons.ButtonBlockDoor,
							ButtonReadFingerprints: terminalButtons.ButtonReadFingerprints,
							ButtonWriteFingerprints: terminalButtons.ButtonWriteFingerprints,
							ButtonRefresh: terminalButtons.ButtonRefresh,
							ButtonSynchronize: terminalButtons.ButtonSynchronize
						})
					}
				})
				return new Promise(resolve => {
					resolveDelegate = resolve
				})
			
		},
		checkDriverType () {
			if (this.isDriverTMC) {
				this.isCrosspoint = false
				this.isTMC = true
				this.isVirtual = false
			} else if (this.isDriverVirtual) {
				this.isCrosspoint = false
				this.isTMC = false
				this.isVirtual = true
			} else if (this.isDriverCrosspoint) {
				this.isCrosspoint = true
				this.isTMC = false
				this.isVirtual = false
			}
		},
		executeAction () {
			if (this.buttonAction === '') {
				return

			}
			var body = {
				SysTerminalId: this.model.Id,
				SysTerminalButtonName: this.buttonAction
			}
			http.post('/api/systerminalbutton/ExecuteButtonAction', body)
		},
		executeActionButton (value, name) {
			if (!value) {
				return

			}
			var body = {
				SysTerminalId: this.model.Id,
				SysTerminalButtonName: name
			}
			http.post('/api/systerminalbutton/ExecuteButtonAction', body)
		},
		getTerminalValidationRulesFor(sysTerminal, field) {
			let methodHelper = this.apiMethod(sysTerminal.add)
			let rules = methodHelper ? methodHelper.Metadata.filter(i => i.FieldName === field) : []
			return validate.convertRulesFormat(rules)
		},
		// getSysTerminalValidationRulesFor (field) {
		// 	let methodHelper = this.apiMethod(sysTerminal.add)
		// 	let rules = methodHelper ? methodHelper.Metadata.filter(i => i.FieldName === field) : []
		// 	return validate.convertRulesFormat(rules)
		// },
		// getSysTerminalCrosspointSettingValidationRulesFor (field) {
		// 	let methodHelper = this.apiMethod(sysTerminalCrosspointSetting.add)
		// 	let rules = methodHelper ? methodHelper.Metadata.filter(i => i.FieldName === field) : []
		// 	return validate.convertRulesFormat(rules)
		// },
		// getSysTerminalTMCSettingValidationRulesFor (field) {
		// 	let methodHelper = this.apiMethod(sysTerminalTMCSetting.add)
		// 	let rules = methodHelper ? methodHelper.Metadata.filter(i => i.FieldName === field) : []
		// 	return validate.convertRulesFormat(rules)
		// }
	},
	mounted () {
		http.waitAll([
			this.getList(),
			this.getDetails(),
			this.getTerminalTypeKeyValues(),
			this.getTerminalDriverKeyValues(),
			this.getTerminalAccessBookingKeyValues(),
			this.getTerminalTimeBookingKeyValues(),
			this.getTerminalComPortKeyValues(),

			this.getTerminalAccessSettingKeyValues(),
			this.getTerminalWhitelistSettingKeyValues(),
			this.getTerminalDoorMonitoringKeyValues(),
			this.getSysCostCenterKeyValues(),

			this.getButtonKeyValues()
		], () => {
			this.selectFirst()
		})
	}
}
</script>

<style scoped>
.purple {
	background-color: #863fdd;
}
.blue {
	background-color: #7d82ff;
}
.red {
	background-color: red;
}
.form-wrapper {
	height: calc(77% - 230px);
	overflow-x: hidden;
	overflow-y: auto;
	position:relative;
}
.form-wrapper .button {
	width: 95px;
	height: 26px;
}
</style>
