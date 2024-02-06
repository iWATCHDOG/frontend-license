/**
 * 用户权限定义
 */
declare namespace Permission {
  /**
   * 实体
   */
  interface Permission {
    id?: number;
    uid?: number;
    permission?: string;
    expiry?: number;
    createTime?: Date;
    updateTime?: Date;
  }

  interface PermissionVO {
    id?: number;
    uid?: number;
    username?: string;
    permission?: string;
    expiry?: number;
    createTime?: Date;
    updateTime?: Date;
  }
}