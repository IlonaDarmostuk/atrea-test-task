<template>
	<div class="scrollable">
		<v-form class="inputs-table overflow-unset">
			<v-form-group :label="vm.labelTranslation('Code') | capitalize" labelStyle="width: 20%">
				<v-input v-model="vm.model.Id" :isEditMode="vm.isChanged" :disabled="!vm.creationMode || !vm.canEdit" name="Id" style="width: 350px" :validate="vm.getValidationRulesFor('Id', relativePath)"></v-input>
			</v-form-group>
			<v-form-group :label="vm.labelTranslation('Description') | capitalize" labelStyle="width: 20%">
				<v-input v-model="vm.model.Description" :isEditMode="vm.isChanged" name="Description" style="width: 350px" :validate="vm.getValidationRulesFor('Description', relativePath)"></v-input>
			</v-form-group>
			<v-form-group :label="vm.labelTranslation('Norm') | capitalize" labelStyle="width: 20%">
				<v-date-time-picker v-model="vm.model.NormHours" :isEditMode="vm.isChanged" containerStyle="width: 80px"  name="NormHours" :onlyTime="true" :validate="vm.getValidationRulesFor('NormHours', relativePath)"></v-date-time-picker>
			</v-form-group>
			<v-form-group :label="vm.labelTranslation('Day frame') | capitalize" labelStyle="width: 20%">
				<div class="inline-block">
					<v-date-time-picker
						name="DayStartAt"
						containerStyle="width: 80px"
						:errorStyle="vm.getErrorMsgStyle()"
						class="inline-block"
						v-model="vm.model.DayStartAt"
						:isEditMode="vm.isChanged"
						:disabled="!vm.creationMode"
						:errorText="vm.getDayScheduleModelErrorText('DayStartAt')"
						:onlyTime="true"
						:afterClose='vm.checkDayScheduleModel'/>
					<span class="separator-line"> - </span>
					<v-date-time-picker
						name="DayStopAt"
						class="inline-block"
						containerStyle="width: 80px"
						:errorStyle="vm.getErrorMsgStyle()"
						v-model="vm.model.DayStopAt"
						:isEditMode="vm.isChanged"
						:disabled="!vm.creationMode"
						:onlyTime="true"
						:errorText="vm.getDayScheduleModelErrorText('DayStopAt')"
						:afterClose='vm.checkDayScheduleModel'/>
					<v-colored-line vertical color="#d64998" width="5px"/><span>&nbsp;</span>
				</div>
			</v-form-group>
			<v-form-group :label="vm.labelTranslation('Access') | capitalize" labelStyle="width: 20%">
				<div class="inline-block">
					<v-date-time-picker
						name="AccessStartAt"
						class="inline-block"
						containerStyle="width: 80px"
						:errorStyle="vm.getErrorMsgStyle()"
						v-model="vm.model.AccessStartAt"
						:isEditMode="vm.isChanged"
						:onlyTime="true"
						:errorText="vm.getDayScheduleModelErrorText('AccessStartAt')"
						:afterClose='vm.checkDayScheduleModel'/>
					<span class="separator-line"> - </span>
					<v-date-time-picker
						name="AccessStopAt"
						class="inline-block"
						containerStyle="width: 80px"
						:errorStyle="vm.getErrorMsgStyle()"
						v-model="vm.model.AccessStopAt"
						:isEditMode="vm.isChanged"
						:onlyTime="true"
						:errorText="vm.getDayScheduleModelErrorText('AccessStopAt')"
						:afterClose='vm.checkDayScheduleModel'/>
					<v-colored-line vertical color="#c94bf1" width="5px"/>
					<span class="info-message">
						{{vm.labelTranslation('Times are limited within \'Day frame\'') + '&nbsp;' + vm.model.DayStartAt + ' - ' + vm.model.DayStopAt | capitalize}}
					</span>
				</div>
			</v-form-group>
			<v-form-group :label="vm.labelTranslation('Overtime') | capitalize" labelStyle="width: 20%">
				<div class="inline-block">
					<v-date-time-picker
						name="OvertimeStartAt"
						class="inline-block"
						containerStyle="width: 80px"
						:errorStyle="vm.getErrorMsgStyle()"
						v-model="vm.model.OvertimeStartAt"
						:isEditMode="vm.isChanged"
						:onlyTime="true"
						:errorText="vm.getDayScheduleModelErrorText('OvertimeStartAt')"
						:afterClose='vm.checkDayScheduleModel'/>
					<span class="separator-line"> - </span>
					<v-date-time-picker
						name="OvertimeStopAt"
						class="inline-block"
						containerStyle="width: 80px"
						:errorStyle="vm.getErrorMsgStyle()"
						v-model="vm.model.OvertimeStopAt"
						:isEditMode="vm.isChanged"
						:onlyTime="true"
						:errorText="vm.getDayScheduleModelErrorText('OvertimeStopAt')"
						:afterClose='vm.checkDayScheduleModel'/>
					<v-colored-line vertical color="#9a8bff" width="5px"/>
					<span class="info-message">
						{{vm.labelTranslation('Times are limited within \'Access\'') + '&nbsp;' + vm.model.AccessStartAt + ' - ' + vm.model.AccessStopAt | capitalize}}
					</span>
				</div>
			</v-form-group>
			<v-form-group :label="vm.labelTranslation('Edge time') | capitalize" labelStyle="width: 20%">
				<div class="inline-block">
					<v-date-time-picker
						name="StartAt_Edge"
						class="inline-block"
						containerStyle="width: 80px"
						:errorStyle="vm.getErrorMsgStyle()"
						v-model="vm.model.StartAt"
						:isEditMode="vm.isChanged"
						:onlyTime="true"
						:errorText="vm.getDayScheduleModelErrorText('StartAt')"
						:afterClose='vm.checkDayScheduleModel'/>
					<span class="separator-line"> - </span>
					<v-date-time-picker
						name="StopAt_Edge"
						class="inline-block"
						containerStyle="width: 80px"
						:errorStyle="vm.getErrorMsgStyle()"
						v-model="vm.model.StopAt"
						:isEditMode="vm.isChanged"
						:onlyTime="true"
						:errorText="vm.getDayScheduleModelErrorText('StopAt')"
						:afterClose='vm.checkDayScheduleModel'/>
					<v-colored-line vertical color="#4abbff" width="5px"/>
					<span class="info-message">
						{{vm.labelTranslation('Times are limited within \'Overtime\'') + '&nbsp;' + vm.model.OvertimeStartAt + ' - ' + vm.model.OvertimeStopAt | capitalize}}
					</span>
				</div>
			</v-form-group>
			<v-form-group :label="vm.labelTranslation('Block time') | capitalize" labelStyle="width: 20%">
				<div class="inline-block">
					<v-date-time-picker
						name="BlockTimeStartAt"
						class="inline-block"
						containerStyle="width: 80px"
						v-model="vm.model.BlockTimeStartAt"
						:errorStyle="vm.getErrorMsgStyle()"
						:isEditMode="vm.isChanged"
						:onlyTime="true"
						:errorText="vm.getDayScheduleModelErrorText('BlockTimeStartAt')"
						:afterClose='vm.checkDayScheduleModel'/>
					<span class="separator-line"> - </span>
					<v-date-time-picker
						name="BlockTimeStopAt"
						class="inline-block"
						containerStyle="width: 80px"
						:errorStyle="vm.getErrorMsgStyle()"
						v-model="vm.model.BlockTimeStopAt"
						:isEditMode="vm.isChanged"
						:onlyTime="true"
						:errorText="vm.getDayScheduleModelErrorText('BlockTimeStopAt')"
						:afterClose='vm.checkDayScheduleModel'/>
					<v-colored-line vertical color="#49d6ff" width="5px"/>
					<span class="info-message">
						{{vm.labelTranslation('Times are limited within \'Edge time\'') + '&nbsp;' + vm.model.StartAt + ' - ' + vm.model.StopAt | capitalize}}
					</span>
				</div>
			</v-form-group>
		</v-form>
		<v-form class="day-schedule-overview-table overflow-unset">
			<v-form-group labelStyle="width: 10%">
				<div>
					<span v-for="b in getDuration" :key="b" :style="getTimeLineStyle(b - 1, isTwoDaysRange && buildTimeRow()[b - 1] === '00:00')" class="time-line" v-show="(getDuration > 12 ? b % 2 === 1 : true) || isTwoDaysRange && buildTimeRow()[b - 1] === '00:00'">
						<span class="time-title">{{buildTimeRow()[b - 1]}}</span>
					</span>
					<span class="time-line" :style="getTimeLineStyle(getDuration, false, true)"><span class="time-title"> {{buildTimeRow()[buildTimeRow().length - 1]}}</span></span>
				</div>
			</v-form-group>
			<v-form-group class='with-border' :label="vm.labelTranslation('Day frame') | capitalize" labelStyle="width: 15%">
				<div class="line-background">
					<div v-show="isDayFrameTooltipShown" :style="getTooltipStyle()" class="tooltip">
						<span class="bold-text">{{vm.labelTranslation('Day frame') | capitalize}}: </span>{{vm.model.DayStartAt}}-{{vm.model.DayStopAt}}
					</div>
					<div @click="onLineClick($event, 'DayFrame', vm.model.DayStartAt, vm.model.DayStopAt)" :style="this.getLineStyle(vm.model.DayStartAt, vm.model.DayStopAt, '#d64998')"></div>
				</div>
			</v-form-group>
			<v-form-group class='with-border' :label="vm.labelTranslation('Access') | capitalize" labelStyle="width: 15%">
				<div class="line-background">
					<div v-show="isAccessTooltipShown" :style="getTooltipStyle()" class="tooltip">
						<span class="bold-text">{{vm.labelTranslation('Access') | capitalize}}: </span>{{vm.model.AccessStartAt}}-{{vm.model.AccessStopAt}}
					</div>
					<div @click="onLineClick($event, 'Access', vm.model.AccessStartAt, vm.model.AccessStopAt)" :style="this.getLineStyle(vm.model.AccessStartAt, vm.model.AccessStopAt, '#c94bf1')"></div>
				</div>
			</v-form-group>
			<v-form-group class='with-border' :label="vm.labelTranslation('Switch') | capitalize" labelStyle="width: 15%">
				<div class="line-background">
					<div v-show="isSwitchTooltipShown" :style="getTooltipStyle()" class="tooltip extended-tooltip">
						<div><span class="bold-text">{{vm.labelTranslation('Switch') | capitalize}} {{selectedSwitch.Id}}: </span>{{selectedSwitch.StartAt}}-{{selectedSwitch.StopAt}}</div>
						<div><span class="bold-text">{{vm.labelTranslation('Switch to') | capitalize}}:</span> {{selectedSwitch.SwitchTo}}</div>
					</div>
					<div v-for="s in this.vm.model.SysDayScheduleEscapeSchedule1" :key="s.Id" @click="onLineClick($event, 'Switch', s.StartAt, s.StopAt)" class='next-line' :style="getLineStyle(s.StartAt, s.StopAt,'#9aebf9')"></div>
				</div>
			</v-form-group>
			<v-form-group class='with-border' :label="vm.labelTranslation('Overtime') | capitalize" labelStyle="width: 15%">
				<div class="line-background">
					<div v-show="isOvertimeTooltipShown" :style="getTooltipStyle()" class="tooltip">
						<span class="bold-text">{{vm.labelTranslation('Overtime') | capitalize}}: </span>{{vm.model.OvertimeStartAt}}-{{vm.model.OvertimeStopAt}}
					</div>
					<div @click="onLineClick($event, 'Overtime', vm.model.OvertimeStartAt, vm.model.OvertimeStopAt)" :style="this.getLineStyle(vm.model.OvertimeStartAt, vm.model.OvertimeStopAt, '#9a8bff')"></div>
				</div>
			</v-form-group>
			<v-form-group class='with-border' :label="vm.labelTranslation('Breaks') | capitalize" labelStyle="width: 15%">
				<div class="line-background">
					<div v-show="isBreakTooltipShown" :style="getTooltipStyle()" class="tooltip extended-tooltip">
						<div><span class="bold-text">{{vm.labelTranslation('Break') | capitalize}} {{selectedBreak.Id}}: </span>{{selectedBreak.StartAt}}-{{selectedBreak.StopAt}}</div>
						<div><span class="bold-text">{{vm.labelTranslation('Norm') | capitalize}}:</span> {{selectedBreak.Norm}}</div>
					</div>
					<div v-for="b in getBreaks()" :key="b.Id" @click="onLineClick($event, 'Break', b.StartAt, b.StopAt)" class='next-line' :style="getLineStyle(b.StartAt, b.StopAt,'#769aff')"></div>
				</div>
			</v-form-group>
			<v-form-group class='with-border' :label="vm.labelTranslation('Edge time') | capitalize" labelStyle="width: 15%">
				<div class="line-background">
					<div v-show="isEdgeTimeTooltipShown" :style="getTooltipStyle()" class="tooltip">
						<span class="bold-text">{{vm.labelTranslation('Edge time') | capitalize}}: </span>{{vm.model.StartAt}}-{{vm.model.StopAt}}
					</div>
					<div @click="onLineClick($event, 'EdgeTime', vm.model.StartAt, vm.model.StopAt)" :style="this.getLineStyle(vm.model.StartAt, vm.model.StopAt, '#4abbff')"></div>
				</div>
			</v-form-group>
			<v-form-group class='with-border' :label="vm.labelTranslation('Block time') | capitalize" labelStyle="width: 15%" >
				<div class="line-background">
					<div v-show="isBlockTimeTooltipShown" :style="getTooltipStyle()" class="tooltip">
						<span class="bold-text">{{vm.labelTranslation('Block time') | capitalize}}: </span>{{vm.model.BlockTimeStartAt}}-{{vm.model.BlockTimeStopAt}}
					</div>
					<div @click="onLineClick($event, 'BlockTime', vm.model.BlockTimeStartAt, vm.model.BlockTimeStopAt)" :style="this.getLineStyle(vm.model.BlockTimeStartAt, vm.model.BlockTimeStopAt, '#49d6ff')"></div>
				</div>
			</v-form-group>
		</v-form>
	</div>
</template>

<script>
/* global composedPath */

import vueSlider from 'vue-slider-component'
import { sysDaySchedule } from '@/app/api'

export default {
	name: 'overview',
	components: {
		vueSlider
	},
	props: {
		vm: Object
	},
	data () {
		return {
			relativePath: sysDaySchedule.add,
			selectedBreak: {
				StartAt: '00:00',
				StopAt: '00:00',
				Norm: '00:00'
			},
			selectedSwitch: {
				StartAt: '00:00',
				StopAt: '00:00',
				SwitchTo: ''
			},
			isDayFrameTooltipShown: false,
			isOvertimeTooltipShown: false,
			isEdgeTimeTooltipShown: false,
			isBlockTimeTooltipShown: false,
			isAccessTooltipShown: false,
			isBreakTooltipShown: false,
			isSwitchTooltipShown: false,
			style: {
				left: 0
			},
			duration: 0
		}
	},
	mounted () {
		this.$emit('initComponent')
	},
	computed: {
		isTwoDaysRange: function () {
			return moment(this.vm.model.DayStartAt, 'HH:mm').isAfter(moment(this.vm.model.DayStopAt, 'HH:mm'))
		},
		getDuration: function () {
			const modelStartTime = moment(this.vm.model.DayStartAt, 'HH:mm')
			const modelEndTime = moment(this.vm.model.DayStopAt, 'HH:mm')
			let dayFrameDuration = moment.duration(modelEndTime.diff(modelStartTime)).asHours()
			const s = moment(this.vm.model.DayStartAt, 'HH:mm').set('minute', 0)
			const e = moment(this.vm.model.DayStopAt, 'HH:mm')
			if (e.get('minute') !== 0) {
				e.add(1, 'h')
				e.set('minute', 0)
			}
			dayFrameDuration = moment.duration(e.diff(s)).asHours()
			dayFrameDuration = dayFrameDuration < 0 ? 24 + dayFrameDuration : dayFrameDuration
			return dayFrameDuration === 0 ? 24 : dayFrameDuration
		}
	},
	methods: {
		getTimeLineStyle (index, isNewDay, isLastLine) {
			let width = isLastLine ? 0 : 100 / this.getDuration
			let margin = 100 * index / this.getDuration
			return {
				width: width + '%',
				'margin-left': margin + '%',
				color: isNewDay ? '#1eacfc' : '#42526e',
				'border-left': '2px solid ' + (isNewDay ? '#1eacfc' : '#eee')
			}
		},
		_getClickListener (target, name) {
			const clickListener = (e) => {
				let path = e.path || (e.composedPath && e.composedPath()) || composedPath(e.target)
				const classPath = [].concat.apply([], path.map(i => [...(i.classList || [])]))
				if (e.target === target || (classPath.includes('tooltip'))) {
					return
				}
				this.hideTooltips()
				document.removeEventListener('click', clickListener, true)
			}
			return clickListener
		},
		onLineClick (e, name, start, stop) {
			const path = e.path || (e.composedPath && e.composedPath()) || composedPath(e.target)
			const line = path[0]
			this.style.left = line.offsetLeft - 75 + line.offsetWidth / 2 + 'px'

			if (name === 'Break') {
				const selectedBreak = this.getBreaks().filter((item) => item.StartAt === start && item.StopAt === stop)[0]
				if (selectedBreak) {
					this.selectedBreak.StartAt = start
					this.selectedBreak.StopAt = stop
					this.selectedBreak.Id = selectedBreak.Id
					this.selectedBreak.Norm = selectedBreak.NormHours
				}
			}

			if (name === 'Switch' && this.vm.model.SysDayScheduleEscapeSchedule1) {
				const selectedSwitch = this.vm.model.SysDayScheduleEscapeSchedule1.filter((item) => item.StartAt === start && item.StopAt === stop)[0]
				if (selectedSwitch) {
					this.selectedSwitch.Id = selectedSwitch.Id
					this.selectedSwitch.SwitchTo = selectedSwitch.EscapeToDayScheduleId
					this.selectedSwitch.StartAt = start
					this.selectedSwitch.StopAt = stop
				}
			}

			var clickListener = this._getClickListener(e.target, name)
			if (this['is' + name + 'TooltipShown']) {
				document.removeEventListener('click', clickListener, true)
			} else {
				document.addEventListener('click', clickListener, true)
				this['is' + name + 'TooltipShown'] = true
			}
		},
		getTooltipStyle (name) {
			return this.style
		},
		hideTooltips () {
			this.isDayFrameTooltipShown = false
			this.isOvertimeTooltipShown = false
			this.isEdgeTimeTooltipShown = false
			this.isAccessTooltipShown = false
			this.isBlockTimeTooltipShown = false
			this.isBreakTooltipShown = false
			this.isSwitchTooltipShown = false
		},
		getBreaks () {
			return +this.vm.model.EnumBreakTypeId === 0 ? this.vm.model.SysDayScheduleBreak : this.vm.model.SysDayScheduleRelativeBreak
		},
		buildTimeRow () {
			let timeArray = []
			const modelStartTime = moment(this.vm.model.DayStartAt, 'HH:mm')
			const modelEndTime = moment(this.vm.model.DayStopAt, 'HH:mm')
			let startTime = modelStartTime.hour()
			let dayFrameDuration = moment.duration(modelEndTime.diff(modelStartTime)).asHours()
			const s = moment(this.vm.model.DayStartAt, 'HH:mm').set('minute', 0)
			const e = moment(this.vm.model.DayStopAt, 'HH:mm')
			if (e.get('minute') !== 0) {
				e.add(1, 'h')
				e.set('minute', 0)
			}
			dayFrameDuration = moment.duration(e.diff(s)).asHours()
			dayFrameDuration = dayFrameDuration < 0 ? 24 + dayFrameDuration : dayFrameDuration
			if (modelStartTime.isAfter(modelEndTime)) {
				dayFrameDuration = 24 - Math.abs(moment.duration(modelStartTime.diff(modelEndTime)).asHours())
			}
			let endTime = Math.round(startTime + dayFrameDuration)
			for	(let i = startTime; i <= endTime; i += 1) {
				let h = ''
				h = i < 24 ? i : i - 24
				const labelValue = ((h / 10 < 1) ? '0' + h : h) + ':00'
				timeArray.push(labelValue)
			}
			return timeArray
		},
		getLineStyle (start, end, color) {
			const modelStartTime = moment(this.vm.model.DayStartAt, 'HH:mm')
			const modelEndTime = moment(this.vm.model.DayStopAt, 'HH:mm')
			let dayFrameDuration = moment.duration(modelEndTime.diff(modelStartTime)).asHours()
			const s = moment(this.vm.model.DayStartAt, 'HH:mm').set('minute', 0)
			const e = moment(this.vm.model.DayStopAt, 'HH:mm')
			if (e.get('minute') !== 0) {
				e.add(1, 'h')
				e.set('minute', 0)
			}
			dayFrameDuration = moment.duration(e.diff(s)).asHours()
			let startTime = moment(start, 'HH:mm')
			let endTime = moment(end, 'HH:mm')
			let duration = moment.duration(endTime.diff(startTime)).asHours()
			let marginWidth = moment.duration(startTime.diff(s)).asHours()
			marginWidth = marginWidth < 0 ? 24 + marginWidth : marginWidth
			if (startTime.isAfter(endTime)) {
				duration = 24 - Math.abs(moment.duration(startTime.diff(endTime)).asHours())
			}
			if (modelStartTime.isAfter(modelEndTime)) {
				dayFrameDuration = 24 - Math.abs(dayFrameDuration)
			}

			if (dayFrameDuration < Math.floor(duration + marginWidth)) return
			this.duration = duration
			let width = dayFrameDuration > 0 ? 100 * duration / dayFrameDuration : 0
			let margin = dayFrameDuration > 0 ? 100 * marginWidth / dayFrameDuration : 0

			return {
				width: width + '%',
				backgroundColor: color,
				height: '7px',
				'margin-left': 'calc(' + margin + '% + ' + 1 + 'px)',
				cursor: 'pointer'
			}
		}
	}
}
</script>

<style scoped>
.tooltip {
	background-color: #ffffff;
	font-size: 13px;
	min-width: 150px;
	min-height: 45px;
	border-radius: 4px;
	padding: 10px;
	box-shadow: 0px 2px 9px rgba(0, 0, 0, .2);
	position: absolute;
	top: -52px;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}
.extended-tooltip {
	top: -80px
}
.bold-text {
	font-weight: 700
}
.v-form-group-element > .line-background{
	background-color: #EFF2F3;
	height: 7px;
	padding: 0
}
.inputs-table {
	height: auto;
	overflow: hidden;
}
.day-schedule-overview-table {
	height: auto;
	overflow-x: hidden;
	width: calc(100% - 20px);
	padding-right: 20px;
}
.day-schedule-overview-table .time-row {
	left:-40px;
	top: 10px;
	width: calc(100% + 85px)
}
.day-schedule-overview-table .time-block {
	display: inline-block;
	text-align: center
}
.time-block .grid-line {
	height: 310px;
	left: 35px;
	top: 25px;
}
.info-message {
	margin-left: 20px;
	opacity: 0.7;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}
.next-line {
	position: absolute
}
.scrollable {
	overflow: auto;
}

@media only screen and (max-height: 700px) {
	.scrollable {
		height: 440px;
	}
}
.overflow-unset {
	overflow-y: visible;
}

.time-line {
	height: 298px;
	top: 40px;
	position: absolute;
}

.time-title {
	top: -25px;
	left: -20px
}
</style>
