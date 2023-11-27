<template>
<div>
	<v-block :headerText="vm.labelTranslation('Overtime settings') | capitalize">
		<div slot="content">
			<v-form class="overflow-unset">
				<v-form-group :label="vm.labelTranslation('Calculated by') | capitalize" labelStyle="width: 20%">
					<v-select v-model="vm.model.EnumOvertimeTypeId" :options='vm.overtimeTypeKeyValues' style="width: 350px" :validate="vm.getValidationRulesFor('EnumOvertimeTypeId')"></v-select>
				</v-form-group>
				<v-form-group :label="vm.labelTranslation('Surcharge matrix') | capitalize">
					<v-select v-model="vm.model.AllowanceMatrixId" :options="vm.allowanceMatrixKeyValues" style="width: 350px" :validate="vm.getValidationRulesFor('AllowanceMatrixId')"></v-select>
				</v-form-group>
				<v-form-group :label="vm.labelTranslation('Overtime matrix') | capitalize">
					<v-select v-model="vm.model.OvertimeMatrixId" :options="vm.allowanceMatrixKeyValues" style="width: 350px" :validate="vm.getValidationRulesFor('OvertimeMatrixId')"></v-select>
				</v-form-group>
			</v-form>
		</div>
	</v-block>
	<div class="scrollable-area">
		<v-block v-for="overtime in vm.model.SysDayScheduleNormboundOvertime" :key="overtime.Id" :number="overtime.Id" :headerButtonCallback="deleteBlock" :headerText="vm.labelTranslation('Norm overtime category') | capitalize" :headerButtonText="vm.labelTranslation('Delete') | capitalize">
			<div slot="content" class="content-overtime">
				<v-form class="overflow-unset">
					<v-form-group :label="vm.labelTranslation('Norm') | capitalize" labelStyle="width: 20%">
						<div class="inline-block" style="padding-bottom: 15px">
							<v-date-time-picker class="inline-block" v-model="overtime.NormHours" containerStyle="width: 80px" :name="'NormHours_' + overtime.Id" :onlyTime="true" :errorStyle="vm.getErrorMsgStyle()" :errorText="vm.getOvertimeModelErrorText('NormHours', overtime.Id)" :afterClose="vm.checkOvertimeModel"/>
							<span>{{vm.labelTranslation('Threshold') | capitalize}}</span>
							<v-date-time-picker class="inline-block" v-model="overtime.Threshold" containerStyle="width: 80px" :name="'Threshold_' + overtime.Id" :onlyTime="true" :errorStyle="vm.getErrorMsgStyle()" :errorText="vm.getOvertimeModelErrorText('Threshold', overtime.Id)" :afterClose="vm.checkOvertimeModel"/>
						</div>
					</v-form-group>
					<v-form-group :label="vm.labelTranslation('Counter') | capitalize" labelStyle="width: 20%">
						<v-select v-model="overtime.SysCounterId" :options="vm.counterKeyValues" name="SysCounter" style="width: 350px" :validate="vm.getValidationRulesFor('SysCounterId')"></v-select>
					</v-form-group>
					<v-form-group :label="vm.labelTranslation('If less than') | capitalize">
						<v-select v-model="overtime.EnumNormboundOvertimeSettingId" :options="vm.normboundOvertimeSettingKeyValues" name="EnumNormboundOvertimeSetting" style="width: 350px" :validate="vm.getValidationRulesFor('EnumNormboundOvertimeSettingId')"></v-select>
					</v-form-group>
				</v-form>
			</div>
		</v-block>
	</div>
	<div class="add-block">
		<button class="button chip-button secondary" @click="addBlock" :disabled="vm.model.SysDayScheduleNormboundOvertime.length >= 5">{{vm.labelTranslation('Add category') | capitalize }}</button>
	</div>
</div>
</template>

<script>
/* global getIdForItem */

export default {
	props: {
		vm: Object
	},
	methods: {
		addBlock () {
			this.vm.model.SysDayScheduleNormboundOvertime.push(
				{
					Id: getIdForItem(this.vm.model.SysDayScheduleNormboundOvertime, 1, 5),
					SysCounterId: this.vm.counterKeyValues[0].value,
					EnumNormboundOvertimeSettingId: this.vm.normboundOvertimeSettingKeyValues[0].value,
					NormHours: '00:00',
					Threshold: '00:00',
					CustomerId: this.vm.model.CustomerId,
					SysDayScheduleId: this.vm.model.Id,
					ModifiedOn: moment().utc().format('YYYY-MM-DD HH:mm:ss')
				})
		},
		deleteBlock (id) {
			const index = this.vm.model.SysDayScheduleNormboundOvertime.findIndex(e => e.Id === id)
			if (index >= 0) {
				this.vm.model.SysDayScheduleNormboundOvertime.splice(index, 1)
			}
		}
	},
	mounted () {
		this.$emit('initComponent')
	}
}
</script>

<style>
.row-break {
	margin-top: 15px
}
.add-block {
	margin-left: 40px;
	margin-top: 25px
}
.inline-block span:not([class]){
	font-weight: 600;
	margin-left: 20px;
	margin-right: 20px;
}
.scrollable-area {
	overflow-y: auto;
	height: 450px;
}

@media only screen and (max-height: 700px) {
	.scrollable-area {
		height: 190px;
	}
	.add-block {
		margin-top: 0
	}
}
</style>
