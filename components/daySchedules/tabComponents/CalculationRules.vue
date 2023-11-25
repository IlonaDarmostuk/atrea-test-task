<template>
<div>
	<v-form class="overflow-unset">
		<v-form-group :label="vm.labelTranslation('Day type') | capitalize" labelStyle="width: 20%">
			<v-select v-model="dayType" :options="vm.dayTypeKeyValue" style="width: 350px" :validate="vm.getValidationRulesFor('DayTypeId')"></v-select>
		</v-form-group>
		<v-form-group :label="vm.labelTranslation('Selected rules') | capitalize" labelStyle="width: 20%">
			<draggable v-show="this.dayType === 0" v-model="vm.model.SysDayScheduleCalculation.Type0" @start="drag=true" @end="drag=false">
				<div v-for="(element, index) in vm.model.SysDayScheduleCalculation.Type0" :key="element.CalculationId + index + 1" class="calculation-row">
					<i aria-hidden="true" class="fa fa-bars"></i>
					<span style="width:30%">{{element.CalculationId}} - {{vm.labelTranslation('Calculation rule') | capitalize}} {{index + 1}}</span>
					<span style="width:60%">{{element.SysCalculation.Description}}</span>
					<i @click="removeRule(element.Id)" aria-hidden="true" class="fa fa-trash-o cursor-pointer delete"></i>
				</div>
			</draggable>
			<draggable v-show="this.dayType === 1" v-model="vm.model.SysDayScheduleCalculation.Type1" @start="drag=true" @end="drag=false">
				<div v-for="(element, index) in vm.model.SysDayScheduleCalculation.Type1" :key="element.CalculationId + index + 1" class="calculation-row">
					<i aria-hidden="true" class="fa fa-bars"></i>
					<span style="width:30%">{{element.CalculationId}} - {{vm.labelTranslation('Calculation rule') | capitalize}} {{index + 1}}</span>
					<span style="width:60%">{{element.SysCalculation.Description}}</span>
					<i @click="removeRule(element.Id)" aria-hidden="true" class="fa fa-trash-o cursor-pointer delete"></i>
				</div>
			</draggable>
			<draggable v-show="this.dayType === 2" v-model="vm.model.SysDayScheduleCalculation.Type2" @start="drag=true" @end="drag=false">
				<div v-for="(element, index) in vm.model.SysDayScheduleCalculation.Type2" :key="element.CalculationId + index + 1" class="calculation-row">
					<i aria-hidden="true" class="fa fa-bars"></i>
					<span style="width:30%">{{element.CalculationId}} - {{vm.labelTranslation('Calculation rule') | capitalize}} {{index + 1}}</span>
					<span style="width:60%">{{element.SysCalculation.Description}}</span>
					<i @click="removeRule(element.Id)" aria-hidden="true" class="fa fa-trash-o cursor-pointer delete"></i>
				</div>
			</draggable>
			<div>
				<button class="button chip-button secondary" @click="addRule">{{vm.labelTranslation('Add rule') | capitalize }}</button>
			</div>
		</v-form-group>
	</v-form>
	<v-table-selection-dialog ref="rulesSelection"
		:title="vm.labelTranslation('Select calculation rules') | capitalize"
		:selectText="vm.labelTranslation('Select') | capitalize"
		:selectedEntry="selectedEntry"
		:discardText="vm.labelTranslation('Discard') | capitalize">
		<div slot="searchInput">
			<v-search-input ref="searchInput" v-model="searchFilter" :wrapperStyle="{ 'float': 'right' }"></v-search-input>
		</div>
		<div slot='table'>
			<v-data-table :columns="rulesTableColumns" :entries="tableData" :keyField="['Key']" @select="modalRowSelected" :filter="searchFilter">
				<template slot="column::Key">{{ vm.labelTranslation('Calculation rule') | capitalize }}</template>
				<template slot="column::Value">{{ vm.labelTranslation('Description') | capitalize }}</template>
				<template slot="cell::Key" slot-scope="{ props }"><span class="font-bold">{{ props.Key | capitalize }}</span></template>
			</v-data-table>
		</div>
	</v-table-selection-dialog>
</div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
	name: 'calculationRules',
	components: {
		draggable
	},
	props: {
		vm: Object
	},
	computed: {
		tableData: function () {
			return this.vm.enableRules(this.dayType, this.vm.model.SysDayScheduleCalculation)
		}
	},
	data () {
		return {
			searchFilter: '',
			selectedEntry: {},
			rulesTableColumns: [
				{
					key: 'Key',
					width: '26%',
					headerKey: 'Calculation rule'
				},
				{
					key: 'Value',
					headerKey: 'Description'
				}
			],
			dayType: 0
		}
	},
	methods: {
		addRule () {
			this.selectedEntry = null
			this.$nextTick(() => {
				this.$refs.searchInput.focus()
			})
			this.$refs.rulesSelection.show().then(result => {
				if (result) {
					this.vm.model.SysDayScheduleCalculation['Type' + this.dayType].push({
						Id: this.vm.model.SysDayScheduleCalculation['Type' + this.dayType].length + 1,
						SysDayScheduleId: this.vm.model.Id,
						Type: this.dayType,
						CalculationId: result.Key,
						CalculationTypeId: 2, // hardcoded for this page
						SysCalculation: {Description: result.Value}
					})
				}
				this.searchFilter = ''
			})
		},
		removeRule (id, typeId) {
			const index = this.vm.model.SysDayScheduleCalculation['Type' + this.dayType].findIndex(e => e.Id === id && e.Type === this.dayType)
			if (index >= 0) {
				this.vm.model.SysDayScheduleCalculation['Type' + this.dayType].splice(index, 1)
			}
		},
		modalRowSelected (entry) {
			this.selectedEntry = entry
		}
	},
	mounted () {
		this.$emit('initComponent')
	}
}
</script>
