<template>
<div>
	<v-form class="overflow-unset">
		<v-form-group :label="vm.labelTranslation('Business trip') | capitalize" labelStyle="width: 20%">
			<div class="inline-block" style="padding-bottom: 15px">
				<v-date-time-picker
					name="BussinessTripStartAt"
					class="inline-block"
					containerStyle="width: 80px"
					:errorStyle="vm.getErrorMsgStyle()"
					v-model="vm.model.BussinessTripStartAt"
					:isEditMode="vm.isChanged"
					:onlyTime="true"
					:errorText="vm.getDayScheduleModelErrorText('BussinessTripStartAt')"
					:afterClose='vm.checkDayScheduleModel'/>
				<span class="separator-line"> - </span>
				<v-date-time-picker
					name="BussinessTripStopAt"
					class="inline-block"
					containerStyle="width: 80px"
					:errorStyle="vm.getErrorMsgStyle()"
					v-model="vm.model.BussinessTripStopAt"
					:isEditMode="vm.isChanged"
					:onlyTime="true"
					:errorText="vm.getDayScheduleModelErrorText('BussinessTripStopAt')"
					:afterClose='vm.checkDayScheduleModel'/>
			</div>
		</v-form-group>
		<v-form-group :label="vm.labelTranslation('Absence correction') | capitalize" labelStyle="width: 20%">
			<div class="inline-block" style="padding-bottom: 15px">
				<v-date-time-picker
					name="AbsenceStartAt"
					class="inline-block"
					containerStyle="width: 80px"
					:errorStyle="vm.getErrorMsgStyle()"
					v-model="vm.model.AbsenceStartAt"
					:isEditMode="vm.isChanged"
					:onlyTime="true"
					:errorText="vm.getDayScheduleModelErrorText('AbsenceStartAt')"
					:afterClose='vm.checkDayScheduleModel'/>
				<span class="separator-line"> - </span>
				<v-date-time-picker
					name="AbsenceStopAt"
					class="inline-block"
					containerStyle="width: 80px"
					:errorStyle="vm.getErrorMsgStyle()"
					v-model="vm.model.AbsenceStopAt"
					:isEditMode="vm.isChanged"
					:onlyTime="true"
					:errorText="vm.getDayScheduleModelErrorText('AbsenceStopAt')"
					:afterClose='vm.checkDayScheduleModel'/>
				<span>{{vm.labelTranslation('Norm') | capitalize}}</span>
				<v-date-time-picker
					name="CorrectionNormHours"
					:errorStyle="vm.getErrorMsgStyle()"
					class="inline-block"
					containerStyle="width: 80px"
					v-model="vm.model.CorrectionNormHours"
					:isEditMode="vm.isChanged"
					:onlyTime="true"
					:errorText="vm.getDayScheduleModelErrorText('CorrectionNormHours')"
					:afterClose='vm.checkDayScheduleModel'/>
			</div>
		</v-form-group>
		<v-form-group :label="vm.labelTranslation('Forgotten check out') | capitalize" labelStyle="width: 20%">
			<v-date-time-picker v-model="vm.model.ForgottenExitAt" name="ForgottenExitAt" :isEditMode="vm.isChanged" :onlyTime="true" containerStyle="width: 80px" :validate="vm.getValidationRulesFor('ForgottenExitAt')"></v-date-time-picker>
		</v-form-group>
	</v-form>
	<div class="checkboxes-block">
		<div>
			<v-checkbox id="force-check-out" style="display:inline" v-model="vm.model.ForceForgottenExit" ></v-checkbox>
			<label class="label check-label cursor-pointer" for="force-check-out">{{ vm.labelTranslation("Force 'forgotten' check-out bookings") | capitalize}}</label>
		</div>
		<div>
			<v-checkbox id="re-entry" style="display:inline" v-model="vm.model.ReentryAfter24Hrs" ></v-checkbox>
			<label class="label check-label cursor-pointer" for="re-entry">{{ vm.labelTranslation("Re-entry after 24-hours") | capitalize}}</label>
		</div>
		<div>
			<v-checkbox id="transfer" style="display:inline" v-model="vm.model.ResultsForTomorrow" ></v-checkbox>
			<label class="label check-label cursor-pointer" for="transfer">{{ vm.labelTranslation("Transfer results to tomorrow") | capitalize}}</label>
		</div>
		<div>
			<v-checkbox id="active" style="display:inline" v-model="vm.model.Active" ></v-checkbox>
			<label class="label check-label cursor-pointer" for="active">{{ vm.labelTranslation("Active") | capitalize}}</label>
		</div>
	</div>
</div>
</template>

<script>
import { sysDaySchedule } from '@/app/api'
import '@/style/specific'

export default {
	props: {
		vm: Object
	},
	data () {
		return {
			relativePath: sysDaySchedule.add
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
.inline-block span:not([class]),
.row-break span:not([class]) {
	font-weight: 600;
	margin-left: 20px;
	margin-right: 20px;
}
.row-break .v-date-time-picker {
	display: inline;
}
.checkboxes-block {
	margin-left: 20%;
	padding-left: 5px
}
.checkboxes-block div {
	padding: 5px 0px;
}
</style>
