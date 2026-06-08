# File Management Spec

### Requirement: 文件管理页面

系统 SHALL 展示文件元数据分页列表，支持 CRUD 操作。

#### Scenario: 文件列表加载

- **WHEN** 用户访问 `/platform/system/file`
- **THEN** 系统调用 `GET /api/v1/sys/file/page?pageNo=1&pageSize=10` 展示分页表格，列包含：文件名 (fileName)、原始文件名 (original)、存储桶 (bucketName)、目录 (dir)、文件类型 (type)、文件大小 (fileSize)、创建时间 (gmtCreate)、操作（编辑/删除）

#### Scenario: 文件按名称搜索

- **WHEN** 用户在搜索栏输入文件名
- **THEN** 系统调用 `GET /api/v1/sys/file/page?fileName={keyword}` 展示过滤结果

#### Scenario: 创建文件记录

- **WHEN** 用户点击"新增"按钮，填写文件信息（fileName、original、bucketName、dir、type、groupId、fileSize），点击确认
- **THEN** 系统调用 `POST /api/v1/sys/file` 发送数据，成功后刷新列表

#### Scenario: 编辑文件记录

- **WHEN** 用户点击某行的编辑按钮，修改文件信息，点击确认
- **THEN** 系统调用 `PUT /api/v1/sys/file/{id}` 发送更新数据，成功后刷新列表

#### Scenario: 批量删除文件

- **WHEN** 用户勾选多条记录，点击批量删除，确认弹窗后执行
- **THEN** 系统调用 `DELETE /api/v1/sys/file` 发送选中 ID 数组，成功后刷新列表
