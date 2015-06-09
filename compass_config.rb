require 'compass/import-once/activate'
# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
http_path = "/"
css_dir = "/"
sass_dir = "/"
images_dir = "img"
javascripts_dir = "/"

##########出力設定##########
#一般的な表示
output_style = :expanded

#ネスト
#output_style = :nested

#1行表示（コメントあり）
#output_style = :compact

#圧縮
#output_style = :compressed

#ソースマップ
sourcemap = true
##########################

##########パス指定方法##########
#相対パス
#relative_assets = true

#絶対パス（デフォルト）
relative_assets = false
##############################

##########ラインコメント##########
#ラインコメントなし
line_comments = false
#ラインコメントあり
#line_comments = true
################################

##########記述方法##########
#SASS記法
#preferred_syntax = :sass

#SCSS記法
preferred_syntax = :scss
###########################

##########キャッシュ##########
#キャッシュ生成あり
cache = true

#キャッシュ生成なし
cache = false
############################

# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass
