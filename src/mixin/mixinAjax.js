export default {
    data() {
        return {
            $ajaxName: []// Ajax令牌数组
        }
    },
    beforeDestroy() {
        // 遍历取消Ajax
        this.$data.$ajaxName.map((item) => {
            this.$ajaxCancel(item);
        })
    },
    methods: {
        /**
         * 发送Ajax
         * @param baseURL 基础请求路径
         * @param url 请求路径
         * @param method 请求方法
         * @param name ajax名称
         * @param autoCancel 组件销毁自动取消ajax
         * @param qs 是否使用qs库
         * @param errHandler 是否自动处理错误
         * @param bigData 是否使用无埋点统计
         * @param headers 请求头
         * @param data 请求数据
         * @param beforeSend 发送前执行的回调
         * @param errCallback 自动处理错误后执行的回调
         * @param success 成功的回调
         * @param complete 完成的回调
         * @param error 错误的回调
         */
        $ajax(
            {
                baseURL = '',
                url = '',
                method = 'get',
                name = null,
                autoCancel = true,
                qs = false,
                errHandler = true,
                bigData = true,
                headers = {},
                data = {},
                beforeSend = () => {
                },
                errCallback = () => {
                },
                success = () => {
                },
                complete = () => {
                },
                error = () => {
                },
            }
        ) {

            // 声明token
            let ajaxToken = this.$axios.CancelToken.source();

            // 如果传入名字
            if (name) {
                // 取消之前的请求
                this.$ajaxCancel(this[name]);
                // 赋值令牌
                this[name] = ajaxToken;
            }

            // 如果需要自动取消ajax
            if (autoCancel) {
                this.$data.$ajaxName.push(ajaxToken);
            }

            // 发送前执行
            beforeSend();

            // axios对象初始化
            let axiosObj = {
                baseURL: baseURL,
                url: url,
                method: method,
                headers: headers,
            };

            // ajax令牌
            axiosObj.cancelToken = ajaxToken.token;

            // 有发送的数据
            if (method === 'post') {
                // 判断是否使用qs库
                if (qs) {
                    axiosObj.data = this.$qs.stringify(data);
                } else {
                    axiosObj.data = data;
                }
            } else if (axiosObj.method === 'get') {
                axiosObj.params = data;
                // axiosObj.params._ = +new Date();
            } else {
                // 预留的method方法 比如HEAD
            }


            this.$axios(axiosObj).then((res) => {
                if (res.data.generalErrMsg && errHandler) {
                    this.$generalErrFn(res.data.generalErrMsg);
                } else if (res.data.errMsg && errHandler) {
                    let errMsg = res.data.errMsg;
                    // 监听数据库错误
                    if (errMsg.indexOf('ORA-') !== -1 || errMsg.indexOf('服务器') !== -1) {
                        try {
                            console.log(window['ajaxErrMsg']);
                        } catch (err) {
                            this.$fundebug.notifyError(err, {
                                metaData: {
                                    errMsg: errMsg,
                                    data: data
                                }
                            });
                        }
                    }
                    this.$Alert({
                        msg: errMsg,
                        callback: () => {
                            errCallback();
                        }
                    });
                } else {
                    success(res.data, res);
                }
            }).catch((err) => {
                // 令牌取消原因
                if (this.$axios.isCancel(err)) {
                    if (err.message !== '') {
                        console.log(err.message);
                    }
                }
                error();
            }).then(() => {
                complete();
                // 无埋点大数据统计
                if (bigData) {
                    // this.$buriedFreeStatistics(url, data);
                }
            });
        },
        /**
         * 取消ajax
         * @param name ajaxName
         * @param cancelStr 取消ajax原因
         */
        $ajaxCancel(name, cancelStr = '') {
            if (name) {
                name.cancel(cancelStr);
            }
        },
        /**
         * 通用错误处理
         * @param err
         */
        $generalErrFn(err) {
            switch (err) {
                case 'noSession':
                    this.$Alert({
                        msg: this.$t('message.currentPageHasExpired'),
                        callback: () => {
                            window.top.location.href = '/';
                        }
                    });
                    break;
                case 'noAuthority':
                    this.$Alert({
                        msg: this.$t('message.noPermission'),
                        callback: () => {
                            window.top.location.href = '/personalCenter/PersonalCenterMain';
                        }
                    });
                    break;
            }
        }
    }
}
