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
}