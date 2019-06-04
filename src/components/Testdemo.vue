<template>
    <div class="testdemo">
        <el-button @click="getLocationCityData()">getData</el-button>

        {{cityinfo}}

        <el-button @click="getShopList()">getData2</el-button>
        
    </div>
</template>
<script>
    export default {
        name: 'testdemo',
        data() {
            return {
                cityinfo: {},
            }
        },
        mounted () {
            
        },
        methods: {
            // 获取城市列表
            getLocationCityData () {
                this.$ajax({
                    url: 'https://elm.cangdu.org/v1/cities',
                    data: {
                        type: 'guess',
                    },
                    success: (res) => {
                        this.cityinfo = res
                    }
                })
            },
            // 获取商铺列表
            getShopList(){
                this.$ajax({
                    url: 'https://elm.cangdu.org/shopping/restaurants',
                    data: {
                        latitude: String(this.cityinfo.latitude),
                        longitude: String(this.cityinfo.longitude)
                    },
                    success: (res) => {
                        console.log(res)
                    }
                })
            }
        },
    }
</script>
<style lang="scss" scoped>

</style>

