core:
	yarn workspace core build

client:
	yarn workspace client build

server:
	yarn workspace server build

gcp-build: core client server
	# @see https://stackoverflow.com/questions/56586839/why-does-google-app-engine-flex-build-step-fail-while-standard-works-for-the-sam
	# to fix symlink error
	rm -rf packages/**/node_modules