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
import { AssetsService } from './resource.service';
import { CreateAssetsDto } from './dto/create-assets.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from '../decorators/response.decorator';
import { CreateResourceDto } from './dto/create-response.dto';
import { AssetsDtoList, getUserAssetsDto } from './dto/user-assets.dto';
import { DeleteResourceDto } from './dto/delete-assets.dto';
import { UpdateAssetsDto, UpdateResourceDto } from './dto/update-assets.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('资源管理') // 设置 API 组名
@ApiBearerAuth('access-token') // 需要 Bearer Token 认证
@Controller('assets')
export class AssetsController {
  constructor(private assetsService: AssetsService) {}

  @Post('/create')
  @UseGuards(AuthGuard('jwt'))
  @Response(UpdateResourceDto)
  @ApiOperation({
    summary: '创建资源',
    description: '资源类型：blog, note, project, contract',
  })
  @ApiBody({
    description: '创建资源的请求体，包含资源类型和相关数据',
    type: CreateAssetsDto,
  })
  @ApiResponse({
    status: 200,
    description: '资源创建成功',
  })
  async create(@Body() dto: CreateAssetsDto) {
    return await this.assetsService.create(dto);
  }

  @Get('/assetList')
  @UseGuards(AuthGuard('jwt'))
  @Response(AssetsDtoList)
  @ApiOperation({
    summary: '获取资源列表',
    description: '根据查询参数获取资源列表',
  })
  @ApiResponse({
    status: 200,
    description: '成功获取资源列表',
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
    description: '资源类型，可选值：blog、note、project、contract',
  })
  async getAssetList(@Query() query: getUserAssetsDto) {
    return await this.assetsService.findAssets(query);
  }

  @Delete('/delete')
  @UseGuards(AuthGuard('jwt'))
  @Response(DeleteResourceDto)
  @ApiOperation({
    summary: '删除资源',
    description: '通过资源 ID 数组批量删除资源',
  })
  @ApiQuery({
    name: 'resourceIds',
    description: '资源 ID 数组',
    required: true,
    type: [Number],
  })
  @ApiResponse({
    status: 200,
    description: '资源删除成功',
    type: DeleteResourceDto,
  })
  async delete(@Query('resourceIds') resourceIds: number[]) {
    return await this.assetsService.deleteResouce(resourceIds);
  }

  @Put('/update')
  @UseGuards(AuthGuard('jwt'))
  @Response(UpdateResourceDto)
  @ApiOperation({ summary: '更新资源', description: '更新已有资源的信息' })
  @ApiBody({
    description: '更新资源的请求体，包含资源 ID 和相关数据',
    type: UpdateAssetsDto,
  })
  @ApiResponse({
    status: 200,
    description: '资源更新成功',
  })
  async update(@Body() dto: UpdateAssetsDto) {
    return await this.assetsService.updateAssets(dto);
  }
}
