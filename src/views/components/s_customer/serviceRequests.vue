<template>
    <div style="width:600px;height:400px;" id="service_request_con"></div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'serviceRequests',
    data(){
        return {
            xNum: [],
            yNum: [],
        }
    },
    created () {
        this.$get( 'report/taskTimeP')
            .then( (data) => {
                if(data.code) {
                    for(let i = 0; i < data.content.left_count.length; i++){
                        this.xNum.push({
                            value: data.content.left_count[i].has,
                            tooltip: {
                                triggerL: 'axis',
                                backgroundColor : 'rgba(45, 135, 253, 0.7)', 
                                borderRadius : 8,
                                padding: 10,
                                formatter:"{b}：" + data.content.left_count[i].scale + '%'
                            },
                        });
                    }
                    this.mounted();
                }
            })
            .catch( (error) => {

            })
    },
    methods: {
         mounted () {
            const option = {
                color: ['#3398DB'],
                tooltip : {
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : ['执行申请', '订单分配', '派单', '待客户定稿', '待完稿出品', '待售前提案','首付款确认'],
                        axisTick: {
                            alignWithLabel: true,
                        },
                        axisLabel: {
                            show: true,
                            interval: 0,
                            textStyle: {
                                color: '#999999'
                            }
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#2D87FD',
                                width: 4,
                            }
                        } 
                    }
                ],
                yAxis : [
                    {
                        // type : 'category',
                        // data : [100,200,500,1000],
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#2D87FD',
                                width: 4,
                            }
                        } 
                    }
                ],
                series: [{
                    type: 'bar',
                    barWidth: '40%',
                    data: this.xNum,
                }],
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: '{c}'
                    }
                },
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(175, 209, 255, 0.5)'
                        }, {
                            offset: 1,
                            color: 'rgba(45, 135, 253, 1)'
                        }]),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                }
            };
            const serviceRequestCharts = echarts.init(document.getElementById('service_request_con'));
            serviceRequestCharts.setOption(option);

            window.addEventListener('resize', function () {
                serviceRequestCharts.resize();
            });
        },
    },
};
 
</script>