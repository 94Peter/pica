require 'compass/import-once/activate'
# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
http_path = "/"					# 根目錄位置
css_dir = "assets/css"					# CSS資料夾路徑
sass_dir = "sass"				# Sass資料夾路徑
images_dir = "images"			# 圖片資料夾路徑
javascripts_dir = "javascripts"	# JS資料夾路徑

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed
output_style = :compressed			# 輸出css的格式：預設 / 有縮排階層 / 簡潔 / 壓縮

# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = true			# 執行相對路徑

# To disable debugging comments that display the original location of your selectors. Uncomment:
line_comments = false			#如果你不希望你的CSS碼有註解的話，就拿掉註解


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass
