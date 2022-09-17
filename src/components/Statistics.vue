<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue'
import type { EChartsOption } from '../utils/echarts'
import { echarts } from '../utils/echarts'
const props = defineProps({
  person: String,
})
const statisMap = inject<Map<string, Map<number, number>> >('statisMap')
const echartRef = ref<null | HTMLDivElement>(null)
const chartData = {
  all: 0,
  charts: {
  } as Record<string, number>,
}

onMounted(() => {
  if (echartRef.value) {
    const dataMap = statisMap!.get(props.person!)
    if (dataMap) {
      chartData.all = 0
      for (const [key, value] of dataMap.entries()) {
        chartData.charts[`Group${key}`] = value
        chartData.all += value
      }
    }
    const myChart = echarts.init(echartRef.value)
    myChart.setOption(getOption())
    window.onresize = function () {
      myChart.resize()
    }
  }
})

function getOption(): EChartsOption {
  return {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: '55%',
    },
    textStyle: {
      fontFamily: 'Microsoft YaHei',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: 'normal',
    },
    title: [
      {
        text: '分组情况柱状图',
        subtext: `总计 ${chartData.all}`,
        left: '25%',
        textAlign: 'center',
        subtextStyle: {
          color: '#444',
          fontSize: 14,
        },
      },
      {
        text: '分组情况饼图',
        subtext: `总计 ${chartData.all}`,
        left: '75%',
        textAlign: 'center',
        subtextStyle: {
          color: '#444',
          fontSize: 14,
        },
      },
    ],
    grid: [
      {
        top: 50,
        width: '50%',
        bottom: '0%',
        left: 10,
        containLabel: true,
      },

    ],
    xAxis: [
      {
        type: 'value',
        max: chartData.all,
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: '#ddd',
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#ddd',
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'category',
        data: Object.keys(chartData.charts),
        axisLabel: {
          interval: 0,
          rotate: 30,
          color: '#ddd',
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#ddd',
          },
        },
      },
    ],
    series: [
      {
        type: 'bar',
        stack: 'chart',
        z: 3,
        label: {
          position: 'right',
          show: true,
        },
        data: Object.keys(chartData.charts).map((key) => {
          return chartData.charts[key]
        }),
      },
      {
        type: 'bar',
        stack: 'chart',
        silent: true,
        itemStyle: {
          color: '#eee',
        },
        data: Object.keys(chartData.charts).map((key) => {
          return chartData.all - chartData.charts[key]
        }),
      },
      {
        type: 'pie',
        radius: [0, '30%'],
        center: ['75%', '50%'],
        data: Object.keys(chartData.charts).map((key) => {
          return {
            name: key,
            value: chartData.charts[key],
          }
        }),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
}
</script>

<template>
  <div style="margin: 2rem 0;">
    <div ref="echartRef" style="height:50vh;" />
  </div>
</template>

<style scoped>

</style>
