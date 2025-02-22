import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response } from '../decorators/response.decorator';
import {
  LoginDto,
  LoginParamsDto,
  ResetPasswordDto,
  VerifyCodeParamsDto,
  VerifyDto,
} from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@ApiTags('认证模块')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: '用户登录' })
  @ApiBody({ description: '登录信息', type: LoginParamsDto })
  @ApiResponse({ status: 200, description: '成功返回 Token' })
  @ApiResponse({ status: 400, description: '用户名或密码不能为空' }) // 给 400 错误描述清晰的内容
  @Response(LoginDto)
  async login(@Body() dto: LoginParamsDto) {
    const { email, password } = dto;
    if (!email || !password) {
      throw new HttpException('用户名或密码不能为空', HttpStatus.BAD_REQUEST);
    }
    return this.authService.login(email, password);
  }

  @Post('/verifyCode')
  @ApiOperation({
    summary: '发送验证码',
    description: '注册类型为0，重置密码类型为1',
  })
  @ApiBody({
    description: '邮箱与请求类型',
    type: VerifyCodeParamsDto,
  })
  @ApiResponse({ status: 200, description: '验证码已发送' })
  @ApiResponse({ status: 400, description: '参数错误' })
  @Response(VerifyDto)
  async sendVerificationCode(
    @Body()
    verifyCodeDto: VerifyCodeParamsDto,
  ) {
    const { email, type } = verifyCodeDto;

    if (!email || typeof type !== 'number' || ![0, 1].includes(type)) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }

    return this.authService.sendVerificationCode(email, type);
  }

  @Post('/register')
  @ApiOperation({
    summary: '用户注册',
    description: '通过邮箱和验证码注册用户',
  })
  @ApiBody({
    description: '注册信息',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', description: '邮箱地址' },
        password: { type: 'string', description: '用户密码' },
        code: { type: 'number', description: '验证码' },
      },
    },
  })
  @ApiResponse({ status: 201, description: '注册成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  @Response(LoginDto)
  async register(
    @Body()
    dto: CreateUserDto,
  ) {
    const { email, password, code } = dto;

    if (!email || !password || !code) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }

    return this.authService.register(email, password, code);
  }

  @Post('/resetPassword')
  @ApiOperation({ summary: '重置密码', description: '通过验证码重置用户密码' })
  @ApiBody({
    description: '重置密码信息',
    type: ResetPasswordDto,
  })
  @ApiResponse({ status: 200, description: '密码重置成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  @Response(VerifyDto)
  async resetPassword(
    @Body()
    { email, resetCode, newPassword }: ResetPasswordDto,
  ) {
    if (!email || !resetCode || !newPassword) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }

    return this.authService.resetPassword(email, resetCode, newPassword);
  }
}
