# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **kava-business-platform-admin**, an early-stage project using Claude Code + Speckit + Trae with the GLM-5 model. The project uses a structured specification-driven development workflow.

## Speckit Workflow Commands

The project uses a specification-first development workflow. Execute commands in this order:

1. **`/speckit.specify "<feature description>"`** - Create a feature specification from natural language description. Creates a new branch and `spec.md` in `specs/<feature-name>/`.

2. **`/speckit.clarify`** - Identify ambiguities in the current spec and ask up to 5 targeted clarification questions. Run before planning.

3. **`/speckit.plan`** - Generate technical implementation plan. Creates `plan.md`, `data-model.md`, `contracts/`, and `research.md` in the feature directory.

4. **`/speckit.tasks`** - Generate dependency-ordered tasks from the plan. Creates `tasks.md` organized by user story priority (P1, P2, P3...).

5. **`/speckit.implement`** - Execute all tasks defined in `tasks.md`. Validates checklists before implementation.

Additional commands:
- **`/speckit.analyze`** - Cross-document consistency analysis (run after tasks generation, before implementation)
- **`/speckit.checklist`** - Generate requirement quality checklists for validation
- **`/speckit.constitution`** - Create or update project charter in `.specify/memory/constitution.md`
- **`/speckit.taskstoissues`** - Convert tasks to GitHub issues

## Available Skills

- **`/simple`** - Invoke before creative/architectural work. A brainstorming process for fast decision-making. Do NOT write code until user approves a direction.
- **`/frontend-design`** - Create production-grade frontend interfaces with high design quality.
- **`/web-design-guidelines`** - Review UI code for accessibility and best practices compliance.

## Project Structure

```
.
├── .claude/           # Claude Code configuration
│   ├── commands/      # Speckit slash commands (speckit.*.md)
│   ├── skills/        # Symlinks to .agents/skills/
│   └── settings.json  # Claude settings
├── .agents/           # Shared skills across AI tools
│   └── skills/        # frontend-design, simple, web-design-guidelines
├── .specify/          # Speckit configuration
│   ├── memory/        # constitution.md (project charter)
│   ├── scripts/bash/  # Setup and context scripts
│   └── templates/     # spec, plan, tasks, checklist templates
├── .trae/             # Trae configuration (symlinks to .agents/skills/)
└── specs/             # Feature specifications (created by /speckit.specify)
```

## Key Scripts

- `.specify/scripts/bash/create-new-feature.sh` - Creates feature branch and initializes spec file
- `.specify/scripts/bash/check-prerequisites.sh` - Validates feature context and returns paths
- `.specify/scripts/bash/setup-plan.sh` - Sets up planning environment
- `.specify/scripts/bash/update-agent-context.sh` - Updates agent-specific context files

## Spec File Locations

When creating features, files are organized in `specs/<feature-name>/`:
- `spec.md` - Feature specification (user stories, requirements, success criteria)
- `plan.md` - Technical implementation plan
- `tasks.md` - Dependency-ordered implementation tasks
- `data-model.md` - Entity definitions (if applicable)
- `contracts/` - API specifications (if applicable)
- `research.md` - Technical decisions and rationale
- `checklists/` - Requirement quality checklists

## Specification Guidelines

From the speckit templates:
- **Focus on WHAT and WHY**, avoid implementation details (HOW)
- User stories must be independently testable (P1, P2, P3 priority)
- Success criteria must be measurable and technology-agnostic
- Maximum 3 `[需要澄清]` markers per spec - make informed guesses with documented assumptions
- Run `/speckit.clarify` to resolve ambiguities before `/speckit.plan`