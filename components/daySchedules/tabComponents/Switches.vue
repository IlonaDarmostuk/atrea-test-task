<template>
<div>
	<div class="scrollable-area">
		<v-block v-for="escape in vm.model.SysDayScheduleEscapeSchedule1" :key="escape.Id" :number="escape.Id" :headerButtonCallback="deleteBlock" :headerText="vm.labelTranslation('Switch') | capitalize" :headerButtonText="vm.labelTranslation('Delete') | capitalize">
			<div slot="content" class="content-switch">
				<v-form class="overflow-unset">
					<v-form-group :label="vm.labelTranslation('Time') | capitalize" labelStyle="width: 20%">
						<div class="inline-block">
							<v-date-time-picker
							class="inline-block"
							v-model="escape.StartAt"
							containerStyle="width: 80px; margin-bottom: 10px"
							:name="'StartAt_' + escape.Id"
							:onlyTime="true"
							:isEditMode="vm.isChanged"
							:errorStyle="vm.getErrorMsgStyle()"
							:errorText="vm.getSwitchModelErrorText('StartAt', escape.Id)"
							:afterClose="vm.checkSwitchModel"/>
							<span class="separator-line"> - </span>
							<v-date-time-picker
							class="inline-block"
							v-model="escape.StopAt"
							containerStyle="width: 80px"
							:name="'StopAt_' + escape.Id"
							:onlyTime="true"
							:isEditMode="vm.isChanged"
							:errorStyle="vm.getErrorMsgStyle()"
							:errorText="vm.getSwitchModelErrorText('StopAt', escape.Id)"
							:afterClose="vm.checkSwitchModel"/>
							<v-colored-line vertical color="#b373ff" width="5px"/>
						</div>
					</v-form-group>
					<v-form-group :label="vm.labelTranslation('Day schedule') | capitalize" labelStyle="width: 20%">
						<v-select v-model="escape.EscapeToDayScheduleId" :options="vm.dayScheduleKeyValues" :isEditMode="vm.isChanged" name="EscapeToDayScheduleId" style="width: 350px" :validate="vm.getValidationRulesFor('SysDayScheduleId', relativePath)"></v-select>
					</v-form-group>
					<v-form-group :label="vm.labelTranslation('Surcharge matrix') | capitalize">
						<v-select v-model="escape.EscapeToAllowanceMatrixId" :options="vm.allowanceMatrixKeyValues" :isEditMode="vm.isChanged" name="EscapeToAllowanceMatrixId" style="width: 350px" :validate="vm.getValidationRulesFor('EscapeToAllowanceMatrixId', relativePath)"></v-select>
					</v-form-group>
					<v-form-group :label="vm.labelTranslation('Overtime matrix') | capitalize">
						<v-select v-model="escape.EscapeToOvertimeMatrixId" :options="vm.allowanceMatrixKeyValues" :isEditMode="vm.isChanged" name="EscapeToOvertimeMatrixId" style="width: 350px" :validate="vm.getValidationRulesFor('EscapeToOvertimeMatrixId', relativePath)"></v-select>
					</v-form-group>
				</v-form>
			</div>
		</v-block>
	</div>
	<div class="add-block">
		<button class="button chip-button secondary" @click="addBlock" :disabled='!enabledBtn'>{{vm.labelTranslation('Add switch') | capitalize }}</button>
	</div>
</div>
</template>

<script>
import { sysDayScheduleEscapeSchedule } from '@/app/api'

export default {
/* global getIdForItem */

	props: {
		vm: Object
	},
	data () {
		return {
			relativePath: sysDayScheduleEscapeSchedule.add
		}
	},
	mounted () {
		this.$emit('initComponent')
	},
	computed: {
		enabledBtn: function () {
			return this.vm.model.SysDayScheduleEscapeSchedule1.length < 3 && !this.vm.model.SysDayScheduleEscapeSchedule1.some((item) => !item.StartAt || !item.StopAt || !item.EscapeToDayScheduleId)
		}
	},
	methods: {
		addBlock () {
			this.vm.model.SysDayScheduleEscapeSchedule1.push({
				StartAt: '00:00',
				StopAt: '00:00',
				SysDayScheduleId: this.vm.model.Id,
				CustomerId: this.vm.model.CustomerId,
				EscapeToAllowanceMatrixId: null,
				EscapeToOvertimeMatrixId: null,
				EscapeToDayScheduleId: null,
				ModifiedOn: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
				Id: getIdForItem(this.vm.model.SysDayScheduleEscapeSchedule1, 1, 3)
			})
		},
		deleteBlock (id) {
			const index = this.vm.model.SysDayScheduleEscapeSchedule1.findIndex(e => e.Id === id)
			if (index >= 0) {
				this.vm.model.SysDayScheduleEscapeSchedule1.splice(index, 1)
			}
		}
	}
}
</script>

<style>
.row-switch {
    margin-top: 15px
}
.add-block {
	margin-left: 40px;
	margin-top: 25px
}
.scrollable-area {
	overflow-y: auto;
	height: 680px;
}
.error-class {
	position: absolute;
    width: max-content;
    top: 35px;
}
@media only screen and (max-height: 700px) {
	.scrollable-area {
		height: 360px;
	}
	.add-block {
		margin-top: 0
	}
}
.overflow-unset {
	overflow-y: visible;
}
</style>
