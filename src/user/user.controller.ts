import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Response } from '../decorators/response.decorator';
import { AddUserDto, AddUserRes } from './dto/add-user.dto';
import { FindUserDto, FindUserListDto } from './dto/find-users.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserDto, UpdateUserRes } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('用户管理') // 设置 API 组名
@ApiBearerAuth('access-token') // 需要 Bearer Token 认证
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/addUser')
  @UseGuards(AuthGuard('jwt'))
  @Response(AddUserRes)
  @ApiOperation({ summary: '添加用户', description: '创建新的用户信息' })
  @ApiBody({
    description: '用户信息',
    type: AddUserDto,
  })
  @ApiResponse({ status: 201, description: '用户添加成功' })
  async addUser(@Body() dto: AddUserDto, @Req() req: any) {
    const id = req.user.userId;
    const user = dto as User;
    await this.userService.createIt(id, user);
  }

  @Delete('/delete')
  @UseGuards(AuthGuard('jwt'))
  @Response(DeleteUserDto)
  @ApiOperation({ summary: '删除用户', description: '根据用户 ID 删除用户' })
  @ApiQuery({
    name: 'ids',
    description: '用户 ID 数组',
    required: true,
    type: [Number],
  })
  @ApiResponse({
    status: 200,
    description: '用户删除成功',
  })
  async delete(@Req() req: any, @Query('ids') ids: number[]) {
    const id = req.user.userId;
    return await this.userService.deleteUser(id, ids);
  }

  @Get('/findUserList')
  @UseGuards(AuthGuard('jwt'))
  @Response(FindUserListDto)
  @ApiOperation({
    summary: '获取用户列表',
    description: '查询符合条件的用户列表',
  })
  @ApiResponse({
    status: 200,
    description: '成功获取用户列表',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: '每页返回的数量，默认10',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: '当前页数，默认1',
  })
  @ApiQuery({
    name: 'keywords',
    type: String,
    required: false,
    description: '关键词搜索',
  })
  @ApiQuery({
    name: 'type',
    type: String,
    required: false,
    description: '资源类型，可选值：user、admin',
  })
  async getAssetList(@Query() query: FindUserDto) {
    return await this.userService.findUsers(query);
  }

  @Put('/update')
  @UseGuards(AuthGuard('jwt'))
  @Response(UpdateUserRes)
  @ApiOperation({ summary: '更新用户信息', description: '更新已有用户的信息' })
  @ApiBody({
    description: '更新资源的请求体，包含资源 ID 和相关数据',
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: '用户信息更新成功',
  })
  async update(@Req() req: any, @Body() dto: UpdateUserDto) {
    const id = req.user.userId;
    return await this.userService.updateUser(id, dto);
  }
}
