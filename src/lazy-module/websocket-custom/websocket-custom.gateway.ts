import { Server, Socket } from 'socket.io';

import WsExceptionsFilter from '@filter/ws-exceptions.filter';
import CustomLoggerService from '@lazy-module/logger/logger.service';
import { UseFilters } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import WebsocketCustomService from './websocket-custom.service';
import { EventSocketNameEnum } from './event-socket-name.enum';
import BotService from '@lazy-module/bots/bot.service';

@UseFilters(WsExceptionsFilter)
@WebSocketGateway(6001, { cors: true })
export default class WebsocketCustomGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  indexAtRoom: any = '';

  peers: any = {};

  @WebSocketServer()
  server: Server | undefined;

  constructor(
    private logger: CustomLoggerService,
    private readonly websocketCustomService: WebsocketCustomService,
    private readonly botService: BotService,
  ) {}

  /**
   * after init
   * @param server
   */
  afterInit(server: any) {
    this.logger.log('Socket initialized');
  }

  /**
   * handle disconnect
   * @param client
   */
  handleDisconnect(client: any) {
    this.server?.sockets.emit('disconnected');
  }

  /**
   * hanlde connection
   * @param socket
   */
  async handleConnection(socket: Socket) {
    // try {
    //   const user = await this.websocketCustomService.getUserFromSocket(socket);
    //   if (!user) socket.disconnect(true);
    // } catch (e) {
    //   socket.disconnect(true);
    // }
  }

  /**
   * Send new message from Bot
   *
   * @param data
   */
  handleSendReplyFromBot(data: {
    characterId?: { avatar: string; name: string };
    userId?: { avatar: string; fullName: string };
    text?: string;
    images?: string;
    document?: string;
    replyFromBot: string;
  }) {
    this.server?.sockets.emit(EventSocketNameEnum.MESSAGE_FROM_BOT, data);
  }

  /**
   * Handle send new message
   *
   * @param data
   */
  @SubscribeMessage(EventSocketNameEnum.NEW_MESSAGE)
  async handleNewMessage(@MessageBody() data: any) {
    const replyFromBot = await this._getReplyFromBot(
      data.message,
      data.oldMessages,
    );
    this.server?.sockets.emit(EventSocketNameEnum.RECEIVED_MESSAGE, {
      ...data,
      replyFromBot,
    });
  }

  async _getReplyFromBot(newMessage: string, oldMessages: string[]) {
    const prompt =
      oldMessages.length > 0
        ? `Đoạn hội thoại trước, ${oldMessages.join(
            '\n',
          )}. Chỉ trả lời câu hỏi này (nếu đoạn hội thoại trước có dữ liệu thì dựa vào dữ liệu đó trả lời, không thì bỏ qua đoạn hội thoại trước và trả lời mới theo đúng loại ngôn ngữ đang hỏi): \n${newMessage}`
        : newMessage;

    try {
      const replyFromBot = await this.botService.generateResponseGPT4(prompt);

      return replyFromBot;
    } catch (error) {
      return '';
    }
  }
}
