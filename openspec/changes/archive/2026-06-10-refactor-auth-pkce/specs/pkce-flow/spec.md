## ADDED Requirements

### Requirement: PKCE 参数生成

系统 SHALL 提供 `src/utils/pkce.ts` 工具模块，包含以下函数：

- `generateCodeVerifier()`：生成 43-128 位的随机字符串，使用 `crypto.getRandomValues` + Base64URL 编码
- `generateCodeChallenge(verifier: string)`：对 code_verifier 执行 SHA-256 哈希后 Base64URL 编码，返回 code_challenge
- `generateState(role: string)`：生成 `{role}:{random}` 格式的 state 参数，random 部分为 16 字节随机值 Base64URL 编码

#### Scenario: 生成 code_verifier

- **WHEN** 调用 `generateCodeVerifier()`
- **THEN** 返回 43-128 位的 URL-safe 随机字符串

#### Scenario: 从 code_verifier 派生 code_challenge

- **WHEN** 调用 `generateCodeChallenge(codeVerifier)`
- **THEN** 返回 code_verifier 的 SHA-256 哈希的 Base64URL 编码值

#### Scenario: 生成带角色信息的 state

- **WHEN** 调用 `generateState('platform_admin')`
- **THEN** 返回 `platform_admin:{random}` 格式的字符串，random 部分为 Base64URL 编码的随机值
