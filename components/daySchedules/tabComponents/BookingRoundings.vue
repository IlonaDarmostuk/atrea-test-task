<template>
<div>
	<v-form class="overflow-unset">
		<v-form-group :label="vm.labelTranslation('Time bookings') | capitalize" labelStyle="width: 20%">
			<v-select v-model="vm.model.SysDayScheduleRounding.EnumRoundingOfBookingSettingId" :options="vm.roundingOfBookingKeyValues" name="RoundingOfBooking" style="width: 350px" :validate="vm.getValidationRulesFor('EnumRoundingOfBookingSettingId', relativePath)"></v-select>
		</v-form-group>
		<v-form-group :label="vm.labelTranslation('Project bookings') | capitalize" labelStyle="width: 20%" :hidden="!hasLicense">
			<v-select v-model="vm.model.SysDayScheduleRounding.EnumRoundingOfProjectBookingSettingId" :options="vm.roundingOfProjectBookingKeyValues" name="RoundingOfProjectBooking" style="width: 350px" :validate="vm.getValidationRulesFor('EnumRoundingOfProjectBookingSettingId', relativePath)"></v-select>
		</v-form-group>
	</v-form>
	<v-block :headerText="vm.labelTranslation('Check in') | capitalize">
		<div slot="content">
			<v-form class="overflow-unset">
				<v-form-group :label="vm.labelTranslation('Rounding every') | capitalize" labelStyle="width: 20%">
					<v-date-time-picker
					v-model="vm.model.SysDayScheduleRounding.EntryBookingRoundTo"
					containerStyle="width: 80px"
					name="EntryBookingRoundTo"
					:isEditMode="vm.isChanged"
					:onlyTime="true"
					:errorText="vm.getBookingRoundingsModelErrorText('EntryBookingRoundTo')"
					:afterClose='vm.checkBookingRoundingsModel'/>
				</v-form-group>
				<v-form-group :label="vm.labelTranslation('Rounding threshold') | capitalize">
					<v-date-time-picker
					v-model="vm.model.SysDayScheduleRounding.EntryBookingUpFrom"
					:isEditMode="vm.isChanged" name="EntryBookingUpFrom"
					:onlyTime="true" containerStyle="width: 80px"
					:errorText="vm.getBookingRoundingsModelErrorText('EntryBookingUpFrom')"
					:afterClose='vm.checkBookingRoundingsModel'/>
				</v-form-group>
			</v-form>
		</div>
	</v-block>
	<v-block :headerText="vm.labelTranslation('Check out') | capitalize">
	<div slot="content">
		<v-form class="overflow-unset">
			<v-form-group :label="vm.labelTranslation('Rounding every') | capitalize" labelStyle="width: 20%">
				<v-date-time-picker
				v-model="vm.model.SysDayScheduleRounding.ExitBookingRoundTo"
				name="ExitBookingRoundTo"
				containerStyle="width: 80px"
				:isEditMode="vm.isChanged"
				:onlyTime="true"
				:errorText="vm.getBookingRoundingsModelErrorText('ExitBookingRoundTo')"
				:afterClose='vm.checkBookingRoundingsModel'/>
			</v-form-group>
			<v-form-group :label="vm.labelTranslation('Rounding threshold') | capitalize">
				<v-date-time-picker
				v-model="vm.model.SysDayScheduleRounding.ExitBookingUpFrom"
				name="ExitBookingUpFrom"
				containerStyle="width: 80px"
				:isEditMode="vm.isChanged"
				:onlyTime="true"
				:errorText="vm.getBookingRoundingsModelErrorText('ExitBookingUpFrom')"
				:afterClose='vm.checkBookingRoundingsModel'/>
			</v-form-group>
		</v-form>
	</div>
</v-block>
</div>
</template>

<script>
import { sysDayScheduleRounding } from '@/app/api'
import { mapActions, mapGetters } from 'vuex'

export default {
	props: {
		vm: Object
	},
	computed: {
		...mapGetters('admin', {
			hasLicense: 'hasLicense'
		})
	},
	methods: {
		...mapActions('admin', {
			checkLicense: 'checkLicense'
		})
	},
	data () {
		return {
			relativePath: sysDayScheduleRounding.add
		}
	},
	created () {
		this.checkLicense()
	},
	mounted () {
		this.$emit('initComponent')
	}
}
</script>

<style scoped>
.overflow-unset {
	overflow-y: visible;
}
</style>
