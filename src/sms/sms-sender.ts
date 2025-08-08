import CoolSms, { Message } from 'coolsms-node-sdk'
import { AddDeleteMessageInfo, OpenMessageInfo, SendSmsMessageInfo } from '../../types/SendSmsMessageInfo'

export class SmsSender {
  private smsService: CoolSms

  constructor (
    apiKey: string,
    secretKey: string,
    private senderPhoneNumber: string,
    private phoneNumbers: string[],
  ) {
    this.smsService = new CoolSms(apiKey, secretKey)
  }

  private sendTextMessage = async (smsText: string) => {
    const messages = this.phoneNumbers.map<Message>(phoneNumber => ({
      to: phoneNumber,
      from: this.senderPhoneNumber,
      autoTypeDetect: false,
      type: 'SMS',
      text: smsText
    }))

    await this.smsService.sendMany(messages)
  }

  sendOpenMessage = async (sendMessageInfo: OpenMessageInfo) => {
    const channelInfoText = sendMessageInfo.channelInfos
      .map(({platform, channelName}) => `[${platform}] ${channelName}`)
      .join('\n')

    const smsText = `🔔방송 ON!\n\n${channelInfoText}\n\n채널의 방송이 시작됐습니다`

    console.log(smsText)

    await this.sendTextMessage(smsText)
  }

  sendAddDeleteMessage = async (sendMessageInfo: AddDeleteMessageInfo) => {
    const smsText = `🔔채널 등록\n[${sendMessageInfo.channelInfo.platform}] ${sendMessageInfo.channelInfo.channelName}\n채널이 추가되었습니다.`

    await this.sendTextMessage(smsText)
  }

  async sendMessage(sendMessageInfo: SendSmsMessageInfo) {
    switch (sendMessageInfo.type) {
      case 'open':
        await this.sendOpenMessage(sendMessageInfo)
        break
      case 'added':
        await this.sendAddDeleteMessage(sendMessageInfo)
        break
    }
  }
}