export MAKE_CACHE := $(shell pwd)/node_modules/.make
include ../../blackmagic.mk

BABEL := node_modules/.bin/babel
CLOC := node_modules/.bin/cloc
CSPELL := node_modules/.bin/cspell
ESLINT := node_modules/.bin/eslint
JEST := node_modules/.bin/jest
LOCKFILE_LINT := node_modules/.bin/lockfile-lint
MAJESTIC := node_modules/.bin/majestic
NEXT := node_modules/.bin/next
PRETTIER := node_modules/.bin/prettier
COLLECT_COVERAGE_FROM := ["src/**/*.{js,jsx,ts,tsx}"]

.PHONY: all
all: build

ACTIONS += install
INSTALL_DEPS := $(call deps,format,package.json)
$(ACTION)/install:
	@$(NPM) install
	@$(call done,install)

ACTIONS += format~install
FORMAT_DEPS := $(call deps,format,$(shell $(GIT) ls-files 2>$(NULL) | \
	$(GREP) -E "\.((json)|(ya?ml)|(md)|([jt]sx?))$$"))
$(ACTION)/format:
#	@for i in $$($(call get_deps,format)); do echo $$i | \
#		$(GREP) -E "\.[jt]sx?$$"; done | xargs $(ESLINT) --fix >/dev/null ||true
	@$(PRETTIER) --write $$($(call get_deps,format))
	@$(call done,format)

ACTIONS += spellcheck~format
SPELLCHECK_DEPS := $(call deps,spellcheck,$(shell $(GIT) ls-files 2>$(NULL) | \
	$(GIT) ls-files | $(GREP) -E "\.(md)$$"))
$(ACTION)/spellcheck:
	-@$(CSPELL) --config $(PROJECT_ROOT)/.cspellrc.json $$($(call get_deps,spellcheck))
	@$(call done,spellcheck)

ACTIONS += lint~spellcheck
LINT_DEPS := $(call deps,lint,$(shell $(GIT) ls-files 2>$(NULL) | \
	$(GREP) -E "\.([jt]sx?)$$"))
$(ACTION)/lint:
#	-@$(LOCKFILE_LINT) --type npm --path package-lock.json --validate-https
	-@$(ESLINT) -f json -o node_modules/.tmp/eslintReport.json $$($(call get_deps,lint)) $(NOFAIL)
	-@$(ESLINT) $$($(call get_deps,lint))
	@$(call done,lint)

ACTIONS += test~lint
TEST_DEPS := $(call deps,test,$(shell $(GIT) ls-files 2>$(NULL) | \
	$(GREP) -E "\.([jt]sx?)$$"))
$(ACTION)/test:
	-@$(JEST) --json --outputFile=node_modules/.tmp/jestTestResults.json --coverage \
		--coverageDirectory=node_modules/.tmp/coverage --testResultsProcessor=jest-sonar-reporter \
		--collectCoverageFrom='$(COLLECT_COVERAGE_FROM)' --findRelatedTests $$($(call get_deps,test))
	@$(call done,test)

ACTIONS += build~test
BUILD_DEPS := $(call deps,build,$(shell $(GIT) ls-files 2>$(NULL) | \
	$(GREP) -E "\.([jt]sx?)$$"))
$(ACTION)/build: dist/index.html ;
	@if [ ! -f $(MAKE_CACHE)/^build ]; then \
		$(MAKE) -s $(ACTION)/^build; \
	fi
	@$(call clear_cache,$(ACTION)/^build)
dist/index.html:
	@$(MAKE) -s $(ACTION)/^build
$(ACTION)/^build:
	@$(NEXT) build $(ARGS)
	@$(NEXT) export -o dist
	@$(call cache,$@)
	@$(call done,build)

.PHONY: prepare
prepare: ;

.PHONY: upgrade
upgrade:
	@$(NPM) upgrade --latest

.PHONY: inc
inc:
	@npm version patch --git=false $(NOFAIL)

.PHONY: count
count:
	@$(CLOC) $(shell $(GIT) ls-files)

.PHONY: publish +publish
publish: build
	@$(MAKE) -s +publish
+publish:
	@$(NPM) publish

.PHONY: pack +pack
pack: build
	@$(MAKE) -s +pack
+pack:
	@$(NPM) pack

.PHONY: coverage
coverage: ~lint
	@$(MAKE) -s +coverage
+coverage:
	@$(JEST) --coverage --collectCoverageFrom='$(COLLECT_COVERAGE_FROM)' $(ARGS)

.PHONY: test-ui
test-ui: ~lint
	@$(MAKE) -s +test-ui
+test-ui:
	@$(MAJESTIC) $(ARGS)

.PHONY: test-watch
test-watch: ~lint
	@$(MAKE) -s +test-watch
+test-watch:
	@$(JEST) --watch $(ARGS)

.PHONY: start +start
start: ~format
	@$(MAKE) -s +start
+start:
	@$(NEXT) dev $(ARGS)

.PHONY: clean
clean:
	-@$(call clean)
	-@$(JEST) --clearCache $(NOFAIL)
	-@$(GIT) clean -fXd \
		-e $(BANG)node_modules/ \
		-e $(BANG)/node_modules \
		-e $(BANG)/node_modules/**/* \
		-e $(BANG)/package-lock.json \
		-e $(BANG)/pnpm-lock.yaml \
		-e $(BANG)/yarn.lock $(NOFAIL)
	-@rm -rf node_modules/.cache $(NOFAIL)
	-@rm -rf node_modules/.tmp $(NOFAIL)

.PHONY: purge
purge: clean
	-@$(GIT) clean -fXd

-include $(patsubst %,$(_ACTIONS)/%,$(ACTIONS))

+%:
	@$(MAKE) -s $(shell echo $@ | sed 's/^\+//g')

%: ;

CACHE_ENVS += \
	BABEL \
	CLOC \
	CSPELL \
	ESLINT \
	JEST \
	LOCKFILE_LINT \
	MAJESTIC \
	NEXT \
	PRETTIER \
