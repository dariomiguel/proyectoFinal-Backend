export default class messagesInsertDTO {

    constructor(messages) {

        this.messages = messages?.user ?? ""
        this.messages = messages?.message ?? ""

    }
}