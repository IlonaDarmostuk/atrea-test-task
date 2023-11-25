<template>
	<div class="table-layout" v-resize="extendTable" tabindex="-1">
		<div class="table-header">
			<table>
				<thead ref="thead" :style="{ 'background-color': tableStyles.header.backgroundColor }">
					<tr :style="`width: calc(100% - ${scrollbarWidth}px)`">
						<th v-for="column in tableColumns" :key="column.key" @click="sortBy(column)"
							:style="{ width: column.width }">
							<slot :name="`column::${column.key}`" :column="column.key">{{ column.key }}</slot>
							<i v-if="sortColumn.key === column.key" class="fa font-bold" aria-hidden="true"
								:class="{ 'fa-angle-up': sortOrder === 1, 'fa-angle-down': sortOrder === -1 }">
							</i>
						</th>
					</tr>
					<tr class="sub-header">
						<slot name="subheader"></slot>
					</tr>
				</thead>
			</table>
		</div>
		<div class="table-body">
			<table>
				<recycle-scroller :page-mode="isIE && !isSpecificIE" :style="{'height': tableStyles.table.height }" class="scroller" :class="{'scroller-height': isSpecificIE}" ref="scroller" :items="tableRows" :item-height="tableStyles.row.height" keyField="__uid">
					<tr slot-scope="{ item, index }" aria-disabled="true" @click="selectRow(item)"
						:class="{
							disabled: creationMode,
							'disabled-item': item.Disabled,
							selected: creationMode ? item.__type === 'new' : item.__uid === selectedUid,
							even: index % 2 === 0,
							blank: item.__type === 'blank'
						}">
						<template v-if="item.__type === 'data'">
							<td v-for="column in tableColumns" :key="column.key"
								:style="{ width: column.width, height: `${tableStyles.row.height}px` }">
								<slot :name="`cell::${column.key}`" :props="item">{{ item[column.key] }}</slot>
							</td>
						</template>
						<template v-else>
							<td :style="{ width: columns[0].width, height: `${tableStyles.row.height}px` }"></td>
						</template>
					</tr>
				</recycle-scroller>
			</table>
		</div>
	</div>
</template>

<script>
import resize from 'vue-resize-directive'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import * as types from '@/helpers/types'
import { sort, search, range } from '@/helpers/utils'

export default {
	directives: {
		resize
	},
	components: {
		RecycleScroller
	},
	props: {
		columns: {
			type: Array,
			default: () => []
		},
		entries: {
			type: Array,
			default: () => []
		},
		keyField: {
			type: [String, Array],
			default: 'Id'
		},
		filter: {
			type: String
		},
		creationMode: {
			type: Boolean,
			default: false
		},
		preventRowSelection: {
			type: Boolean,
			default: false
		},
		styles: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	constants: {
		columnOptions: {
			width: 'auto',
			sortKey: null,
			filterKey: null,
			filterByColumn: true
		},
		newRow: {
			__type: 'new',
			__uid: 'new_row'
		},
		defaultStyles: {
			header: {
				backgroundColor: '#5B6E85'
			},
			row: {
				height: 43
			},
			table: {}
		}
	},
	data () {
		return {
			selectedUid: null,
			blankRowsCount: 0,
			scrollbarWidth: 0,
			sortColumn: {},
			sortOrder: 1
		}
	},
	computed: {
		tableColumns() {
			return this.columns.map(col => this.getColumnOptions(col))
		},
		filterKeys() {
			return this.tableColumns
				.filter(col => col.filterByColumn)
				.map(col => !types.isNull(col.filterKey) ? col.filterKey : col.key)
		},
		dataRows() {
			return this.entries.map(entry => {
				return {
					...entry,
					__type: 'data',
					__uid: this.getUid(entry)
				}
			})
		},
		filteredDataRows() {
			return search(this.dataRows, this.filter, this.filterKeys)
		},
		sortedDataRows() {
			let rows = this.filteredDataRows
			if (this.sortColumn.key) {
				const desc = this.sortOrder === -1
				if (types.isFunction(this.sortColumn.sortKey)) {
					rows.sort((a, b) => sort(this.sortColumn.sortKey(a), this.sortColumn.sortKey(b), desc))
				} else if (types.isString(this.sortColumn.sortKey)) {
					rows.sort((a, b) => sort(a[this.sortColumn.sortKey], b[this.sortColumn.sortKey], desc))
				} else {
					rows.sort((a, b) => sort(a[this.sortColumn.key], b[this.sortColumn.key], desc))
				}
			}
			return rows
		},
		blankRows() {
			return range(this.blankRowsCount, (x, i) => {
				return {
					__type: 'blank',
					__uid: `blank_row_${i}`
				}
			})
		},
		tableRows() {
			return this.sortedDataRows
				.concat(this.creationMode ? this.newRow : [])
				.concat(this.blankRows)
		},
		tableStyles() {
			return {
				header: {
					...this.defaultStyles.header,
					...this.styles.header
				},
				row: {
					...this.defaultStyles.row,
					...this.styles.row
				},
				table: {
					...this.defaultStyles.table,
					...this.styles.table
				}
			}
		},
		rowUids() {
			return this.tableRows.map(i => i.__uid)
		}
	},
	watch: {
		filteredDataRows (newVal, oldVal) {
			if (newVal.length !== oldVal.length) {
				this.extendTable()
			}
		},
		creationMode (newVal) {
			this.extendTable()
			this.$nextTick(() => {
				this.scrollToItem(newVal ? 'new_row' : this.selectedUid)
			})
		},
		selectedEntry (val, oldVal) {
			this.selectedUid = this.getUid(val)
		}
	},
	methods: {
		getUid (entry) {
			return types.isArray(this.keyField)
				? this.keyField.map(kf => entry[kf]).join('-')
				: entry[this.keyField]
		},
		getColumnOptions (column) {
			return types.isObject(column)
				? { ...this.columnOptions, ...column }
				: { ...this.columnOptions, key: column }
		},
		sortBy (column) {
			if (this.sortColumn.key === column.key) {
				this.sortOrder *= -1
			} else {
				this.sortColumn = column
				this.sortOrder = 1
			}
		},
		selectRow (entry) {
			if (!entry) return
			if (this.preventRowSelection) return this.$emit('select')
			if (!entry.__uid || !entry.__type) {
				const uid = this.getUid(entry)
				this.selectedUid = uid
				this.$emit('select', entry)
			} else if (entry.__type === 'data') {
				this.selectedUid = entry.__uid
				this.$emit('select', this.getOriginalEntry(entry))
			}
		},
		select (entry) {
			this.selectRow(entry)
			this.$nextTick(() => {
				this.scrollToItem(this.selectedUid)
			})
		},
		getOriginalEntry (entry) {
			let __entry = {}
			for (let prop in entry) {
				if (prop === '__type' || prop === '__uid') continue
				__entry[prop] = entry[prop]
			}
			return __entry
		},
		scrollToItem (uid) {
			const indexToScroll = this.rowUids.indexOf(uid)
			if (indexToScroll >= 0) {
				this.$refs.scroller.scrollToItem(indexToScroll)
			}
		},
		extendTable () {
			this.blankRowsCount = 0
			const rowCount = this.filteredDataRows.length + (this.creationMode ? 1 : 0)
			let blankHeight = this.$el.clientHeight - this.$refs.thead.clientHeight - this.tableStyles.row.height * rowCount
			if (blankHeight > 0) {
				while (blankHeight >= this.tableStyles.row.height) {
					this.blankRowsCount++
					blankHeight -= this.tableStyles.row.height
				}
			}
		},
		isIE() {
			return global.IS_IE
		},
		isSpecificIE() {
			if (!this.isIE) {
				return false
			}

			const startIndex = navigator.userAgent.indexOf('Windows NT')
			const lastIndex = navigator.userAgent.search(';')

			if (lastIndex === -1 || startIndex === -1) {
				return false
			}

			const winVersion = parseFloat(navigator.userAgent.substring(13, 28).substr(11)) // to get only windows version number
			return winVersion > 6.1 && winVersion < 10
		}
	},
	mounted () {
		this.extendTable()
	},
	beforeUpdate () {
		if (global.IS_IE) {
			this.scrollbarWidth = 17
			return;
		} 

		const tr = this.$refs.scroller.$el.getElementsByClassName('vue-recycle-scroller__item-wrapper')[0].childNodes[0]
		if (!tr) {
			return 
		}

		this.scrollbarWidth = this.$refs.scroller.$el.offsetWidth - tr.offsetWidth === 0 
			? this.scrollbarWidth 
			: this.$refs.scroller.$el.offsetWidth - tr.offsetWidth
	}
}
</script>

<style scoped>
.vue-recycle-scroller {
	overflow-x: hidden;
}

.table-layout {
	background-color: #FFF;
	height: 100%;
}

.table-body {
	height: calc(100% - 35px);
	overflow-y: auto;
}

.table-layout table {
	height: 100%;
	margin: 0;
	align-content: start;
	display: grid;
}

.table-layout tr {
	display: table;
	width: 100%;
	table-layout: fixed;
}

.table-layout th,
.table-layout td {
	padding: 3px 25px;
	border-bottom: none;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.table-layout td {
	vertical-align: middle;
}

.table-layout thead {
	cursor: pointer;
}

.table-layout thead th {
	color: #FFF;
	font-weight: 500;
	height: 35px;
	font-size: 14px;
	text-align: left;
}

.table-layout thead tr.sub-header {
	background-color: #7F90A4;
}

.table-layout thead tr.sub-header th {
	height: 43px;
}

.table-layout thead th:not(:last-child) {
	padding-right: 0;
}

.table-layout tr:not(.blank) {
	cursor: pointer;
}

.table-layout .vue-recycle-scroller__item-view:not(.hover) tr.even:not(.selected) td,
.table-layout .vue-recycle-scroller__item-view tr.even.disabled:not(.selected) td {
	background-color: rgba(189, 202, 208, 0.2);
}

.table-layout tr.selected td,
.vue-recycle-scroller__item-view.hover tr:not(.disabled) td {
	background-color: rgb(214, 229, 238);
}

.table-layout tr,
.table-layout :before,
.table-layout :after,
.table-layout tr.selected,
.vue-recycle-scroller__item-view.hover {
	transition: none;
}

.table-layout thead th.selected {
	color: #999c9d;
}

tr.disabled {
	cursor: default;
	pointer-events: none;
}

.table-layout .scroller {
	transform: translate3d(0, 0, 0);
	-webkit-transform: translate3d(0, 0, 0);
}

.table-layout .scroller.scroller-height {
	height: 655px;
}

.v-table-selection-dialog-body .table-layout .scroller.scroller-height {
	height: 490px;
}

@media only screen and (max-height: 700px) {
	.table-layout .scroller.scroller-height {
		height: 320px;
	}
	.v-table-selection-dialog-body .table-layout .scroller.scroller-height {
		height: 255px;
	}
}

tr.disabled-item {
	cursor: default;
	pointer-events: none;
	color: #ccc;
}
</style>
