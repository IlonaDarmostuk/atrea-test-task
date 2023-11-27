<template>
<div>
	<div class="scrollable">
		<v-form class="break-settings overflow-unset">
			<v-form-group :label="vm.labelTranslation('Break type') | capitalize" labelStyle="width: 20%">
				<v-select v-model="vm.model.EnumBreakTypeId" :options="vm.breakTypeCategoryKeyValues" name="EnumBreakTypeId" style="width: 350px" :validate="vm.getValidationRulesFor('Id')"></v-select>
			</v-form-group>
			<v-form-group v-if="+vm.model.EnumBreakTypeId > 0" :label="vm.labelTranslation('Start of breaks') | capitalize" labelStyle="width: 20%">
				<v-select v-model="vm.model.EnumBreakCategoryTypeId" :options="vm.breakTypeKeyValues.slice(1)" name="EnumBreakCategoryTypeId" style="width: 350px" :validate="vm.getValidationRulesFor('Id')"></v-select>
			</v-form-group>
			<v-form-group :label="vm.labelTranslation('Last calculation') | capitalize" labelStyle="width: 20%">
				<v-date-time-picker
					v-model="lastCalculation"
					name="LastCalculation"
					containerStyle="width: 80px"
					:onlyTime="true"
					:isEditMode="vm.isChanged"
					:disabled="isDisabled"
					:validate="getRule()"
					:textInfo="vm.labelTranslation('The last break is calculated only if the last booking passed the set time') | capitalize">
				</v-date-time-picker>
			</v-form-group>
		</v-form>
		<v-block v-for="b in breaks" :key="b.Id" :number="b.Id" :headerButtonCallback="deleteBlock" :headerText="vm.labelTranslation('Break') | capitalize" :headerButtonText="vm.labelTranslation('Delete') | capitalize">
			<div slot="content" class="content-break">
				<div class="row-break">
					<span>{{vm.labelTranslation('Start') | capitalize}}</span>
					<v-date-time-picker
						:name="'BreakStartAt_' + b.Id"
						containerStyle="width: 80px"
						:errorStyle="vm.getErrorMsgStyle()"
						v-model="b.StartAt"
						:isEditMode="vm.isChanged"
						:onlyTime="true"
						:errorText="vm.getBreakModelErrorText('StartAt', b.Id)"
						:afterClose="vm.checkBreakModel"/>
					<span v-if="+vm.model.EnumBreakTypeId === 0"> - </span>
					<v-date-time-picker
						v-if="+vm.model.EnumBreakTypeId === 0"
						:name="'BreakStopAt_' + b.Id"
						containerStyle="width: 80px"
						v-model="b.StopAt"
						:isEditMode="vm.isChanged"
						:onlyTime="true"
						:errorText="vm.getBreakModelErrorText('StopAt', b.Id)"
						:afterClose="vm.checkBreakModel"/>
					<span>{{vm.labelTranslation('Norm') | capitalize}}</span>
					<v-date-time-picker
						v-model="b.NormHours"
						containerStyle="width: 80px"
						:name="'NormHours_' + b.Id"
						:isEditMode="vm.isChanged"
						:onlyTime="true"
						:errorText="vm.getBreakModelErrorText('NormHours', b.Id)"
						:afterClose="vm.checkBreakModel"/>
					<v-select v-if="+vm.model.EnumBreakTypeId !== 0" style="margin-left:20px;min-width:100px" v-model="b.EnumRelativeBreakSettingId" :options="vm.relativeBreakSettingKeyValues" name="EnumRelativeBreakSettingId" :validate="vm.getValidationRulesFor('EnumRelativeBreakSettingId')"></v-select>
					<v-colored-line vertical color="#7599fe" width="5px"/>
				</div>
			</div>
		</v-block>
	</div>
	<div class="add-block">
		<button class="button chip-button secondary" @click="addBlock" :disabled='!enabledBtn'>{{vm.labelTranslation('Add break') | capitalize }}</button>
	</div>
</div>
</template>

<script>
import { sysDayScheduleBreak } from '@/app/api'
import '@/style/specific'

export default {
/* global getIdForItem */
	name: 'breaks',
	props: {
		vm: Object
	},
	constants: {
	},
	data () {
		return {
			relativePath: sysDayScheduleBreak.add
		}
	},
	mounted () {
		this.$emit('initComponent')
	},
	computed: {
		enabledBtn: function () {
			if (+this.vm.model.EnumBreakTypeId === 0) {
				return this.vm.model.SysDayScheduleBreak.length < 5 && !this.vm.model.SysDayScheduleBreak.some((item) => !item.StartAt || !item.StopAt || !item.NormHours)
			}
			return this.vm.model.SysDayScheduleRelativeBreak.length < 5 && !this.vm.model.SysDayScheduleRelativeBreak.some((item) => !item.StartAt || !item.NormHours)
		},
		isDisabled: function () {
			return ((+this.vm.model.EnumBreakTypeId === 0 && this.vm.model.SysDayScheduleBreak.length !== 5) || (+this.vm.model.EnumBreakTypeId > 0 && this.vm.model.SysDayScheduleRelativeBreak.length !== 5))
		},
		lastCalculation: {
			get () {
				if (+this.vm.model.EnumBreakTypeId === 0) {
					return this.vm.model.SysDayScheduleBreak.length === 5 ? this.vm.model.SysDayScheduleBreak[4].ValidWhenLastBookingAfter : null
				}
				return this.vm.model.SysDayScheduleRelativeBreak.length === 5 ? this.vm.model.SysDayScheduleRelativeBreak[4].ValidWhenLastBookingAfter : null
			},
			set (val) {
				this.vm.model.LastCalculation = val
			}
		},
		breaks () {
			return +this.vm.model.EnumBreakTypeId === 0 ? this.vm.model.SysDayScheduleBreak : this.vm.model.SysDayScheduleRelativeBreak
		},
	},
	methods: {
		getCorrespondValidation (id) {
			return +this.vm.model.EnumBreakTypeId === 0 ? this.vm.combineRulesFor('StartAt', this.relativePath, { lessTimeThan: this.$refs['BreakStopAt_' + id] }) : {}
		},
		getRule () {
			return ((+this.vm.model.EnumBreakTypeId === 0 && this.vm.model.SysDayScheduleBreak.length === 5) || (+this.vm.model.EnumBreakTypeId > 0 && this.vm.model.SysDayScheduleRelativeBreak.length === 5)) ? this.vm.combineRulesFor('LastCalculation', this.relativePath, { required: true }) : {}
		},
		addBlock () {
			let body = {
				CustomerId: this.vm.model.CustomerId,
				StartAt: '00:00',
				NormHours: '00:00',
				ValidWhenLastBookingAfter: '00:00',
				SysDayScheduleId: this.vm.model.Id,
				ModifiedOn: moment().utc().format('YYYY-MM-DD HH:mm:ss')
			}
			return +this.vm.model.EnumBreakTypeId === 0
				? this.vm.model.SysDayScheduleBreak.push({
					...body,
					Id: getIdForItem(this.vm.model.SysDayScheduleBreak, 1, 5),
					StopAt: '00:00'
				})
				: this.vm.model.SysDayScheduleRelativeBreak.push({
					...body,
					Id: getIdForItem(this.vm.model.SysDayScheduleRelativeBreak, 1, 5),
					EnumRelativeBreakSettingId: 0
				})
		},
		deleteBlock (id) {
			if (+this.vm.model.EnumBreakTypeId === 0) {
				const index = this.vm.model.SysDayScheduleBreak.findIndex(e => e.Id === id)
				if (index >= 0) {
					this.vm.model.SysDayScheduleBreak.splice(index, 1)
				}
			} else {
				const index = this.vm.model.SysDayScheduleRelativeBreak.findIndex(e => e.Id === id)
				if (index >= 0) {
					this.vm.model.SysDayScheduleRelativeBreak.splice(index, 1)
				}
			}
		}
	}
}
</script>
