OS := $(shell uname)
ARCH := $(shell uname -m)

ensure_tailwind_cli:
	@if [ ! -e tailwindcss ]; then\
		echo "No installation found";\
		if [ $(OS) = 'Darwin' ] && [ $(ARCH) = 'arm64' ]; then\
			echo "Beginning installation";\
			curl -sLO https://github.com/tailwindlabs/tailwindcss/releases/latest/download/tailwindcss-macos-arm64;\
			chmod +x tailwindcss-macos-arm64;\
			mv tailwindcss-macos-arm64 tailwindcss;\
			echo "Tailwind is now installed as 'tailwindcss'";\
        else\
          echo "Your OS or arch is not supported\nPlease manually install tailwind CLI as 'tailwindcss' in this directory";\
        fi;\
	else\
		echo "Tailwind is already installed.";\
	fi;

tailwind-watch-templates: ensure_tailwind_cli
	@./tailwindcss --watch -c ./tailwind.config.js -o ./resources/public/css/inline-styles.css

tailwind-watch-components: ensure_tailwind_cli
	@./tailwindcss --watch -m -i ./resources/css/* -o ./resources/public/css/styles.css

bundle-js:
	# Removing existing bundle
	@if [ -e resources/public/js/bundled.js ]; then\
		rm resources/public/js/bundled.js;\
	fi
	# Making new bundle
	@paste -s -d "\n" resources/js/*.js >> resources/public/js/bundled.js