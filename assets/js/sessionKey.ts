export const session = reactive({
    key: '',
    setKey() {
        if (localStorage['session']) {
            this.key = localStorage['session']
            return
        }

        const key = crypto.randomUUID()
        localStorage['session'] = key
        this.key = key
    }
}) 