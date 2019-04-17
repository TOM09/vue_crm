<template>
    <div style="width:400px;height:400px;" class="service_request_con"></div>
</template>

<script>

import echarts from 'echarts';

export default {
    name: 'raduisDab',
    data(){
        return {
            countYNum: 0,
            countYNumC: 0,
            numberTop: 0,
            numberBottom: 0,
        }
    },
    created () {
        this.$get( 'report/taskTimeP')
            .then( (data) => {
                if(data.code) {
                    this.countYNum = 100 - data.content.right_count.sale_before;
                    this.countYNumC = 100 - data.content.right_count.sale_end;
                    this.numberTop = data.content.right_count.sale_before;
                    this.numberBottom = data.content.right_count.sale_end;
                    this.mounted();
                }
            })
            .catch( (error) => {

            })
    },
    methods : {
        mounted () {
            let labelTop = {
                normal : {
                    label : {
                        show : true,
                        position : 'center',
                        formatter : '{b}',
                        textStyle: {
                            baseline : 'bottom'
                        }
                    },
                    labelLine : {
                        show : false
                    }
                }
            };
            let option = {
                series: [ 
                {
                    type: 'pie',
                    center : ['180px','140px'],
                    radius: ['25%', '30%'],
                    label: {
                        normal: {
                            position: 'center'
                        }
                    },
                    data: [{
                        value: this.numberTop,
                        itemStyle: {
                            normal: {
                                color: '#ffd285'
                            }
                        },
                        label: {
                            normal: {
                                formatter: '{d} %',
                                textStyle: {
                                    color: '#ffd285',
                                    fontSize: 20

                                }
                            }
                        }
                    }, {
                        value: this.countYNum,
                        name: '占位',
                        tooltip: {
                            show: false
                        },
                        itemStyle: {
                            normal: {
                                color: '#b04459'
                            }
                        },
                        label: {
                            normal: {
                                textStyle: {
                                    color: '#ffd285',
                                },
                                formatter: '\n售前调用'
                            }
                        }
                    }]
                },
                {
                    type: 'pie',
                    center : ['180px','310px'],
                    radius: ['25%', '30%'],
                    label: {
                        normal: {
                            position: 'center'
                        }
                    },
                    data: [{
                        value: this.numberBottom,
                        itemStyle: {
                            normal: {
                                color: '#ff733f'
                            }
                        },
                        label: {
                            normal: {
                                formatter: '{d} %',
                                textStyle: {
                                    color: '#ff733f',
                                    fontSize: 20

                                }
                            }
                        }
                    }, {
                        value: this.countYNumC,
                        name: '占位',
                        tooltip: {
                            show: false
                        },
                        itemStyle: {
                            normal: {
                                color: '#b04459'


                            }
                        },
                        label: {
                            normal: {
                                textStyle: {
                                    color: '#ff733f',
                                },
                                formatter: '\n成单执行'
                            }
                        }
                    }]
                }]
                // series : [
                //     {
                //         type : 'pie',
                //         center : ['180px','140px'],
                //         radius : ['50px','70px'],
                //         x: '0%', // for funnel
                //         itemStyle : labelFromatter,
                //         data : [
                //             {name:'other', value:this.countYNum, itemStyle : labelBottom},
                //             {name:'售前调用', value:this.numberTop,itemStyle : labelTop}
                //         ]
                //     },
                //     {
                //         type : 'pie',
                //         center : ['180px','310px'],
                //         radius : ['50px','70px'],
                //         x:'20%', // for funnel
                //         itemStyle : labelFromatter,
                //         data : [
                //             {name:'other', value:this.countYNumC, itemStyle : labelBottom},
                //             {name:'成单执行', value:this.numberBottom,itemStyle : labelTop}
                //         ]
                //     },
                // ]
            };
            
            const serviceRequestCharts = echarts.init(document.getElementsByClassName('service_request_con')[0]);
            serviceRequestCharts.setOption(option);

            window.addEventListener('resize', function () {
                serviceRequestCharts.resize();
            });
        }
    }
};
</script>

