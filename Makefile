# Colors
GREEN  := \033[0;32m
YELLOW := \033[0;33m
RESET  := \033[0m

# Help command to display usage instructions
help:
	@echo "$(GREEN)Usage:$(RESET)"
	@echo "  $(YELLOW)make start/auth$(RESET)            Serve auth app on port 4200"
	@echo "  $(YELLOW)make start/dash$(RESET)            Serve dash app on port 4201"
	@echo "  $(YELLOW)make start/land$(RESET)            Serve land app on port 4202"
	@echo "  $(YELLOW)make component project=<project> name=<name>$(RESET)   Generate component in specified project"
	@echo "  $(YELLOW)make service project=<project> name=<name>$(RESET)     Generate service in specified project"
	@echo "  $(YELLOW)make build project=<project>$(RESET)       Build project with watch flag"
	@echo "  $(YELLOW)make help$(RESET)                          Display usage instructions"
	@echo ""
	@echo "Note: Replace <project> with the desired project name, and <name> with the actual name of the component or service."

.PHONY: help


# Serve auth app
start/auth:
	ng serve  --project auth --port 4200

# Serve dash app
start/dash:
	ng serve --project dashboard --port 4201

# Serve land app
start/land:
	ng serve --project landing --port 4202

# Generate component in specified project
component:
	ng generate component components/$(name) --project $(project)

# Generate component in specified project
service:
	ng generate service services/$(name) --project $(project)

# Build shared library with watch flag
build:
	npm run build --project $(project) --watch --sourceMap

# Run linter and prettier to check and fix any code issue
lint:
	@npm run lint:fix
	@npm run pretty-quick