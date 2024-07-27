import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './user.type';
import { updateProfileDto } from './dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}
    async updateProfile(info:updateProfileDto){
        if (info?.avatarUrl){
            return await this.prisma.user.update({
                where:{
                    id:info.id
                },
                data:{
                    avatarUrl: info.avatarUrl,
                    
                }
            })
        }
        return await this.prisma.user.update({
            where:{
                id:info.id
            },
            data:{
                
                fullname:info.fullname
            }
        })

    }

}
