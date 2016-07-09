# encoding: utf-8
# SEE ALSO: http://spin.atomicobject.com/2013/09/23/deploy-aws-s3-rake/

require 'aws'
require 'logger'
require 'mime-types'

log = Logger.new(STDOUT)
log.level = Logger::INFO

pwd = Dir.getwd

from_folder = 'src'
to_folder   = 'assets'

header_max_age = 'max-age=604800'

desc 'Deploy to S3'
task :deploy do
    s3 = Aws::S3.new(
        ENV['AWS_ACCESS_KEY_ID'],
        ENV['AWS_SECRET_ACCESS_KEY']
    )

    bucket = s3.bucket(ENV['AWS_S3_BUCKET'], true)

    Dir.chdir(from_folder)

    log.info('Beginning to deploy files')

    Dir["**/*"].each do |file|
        next if File.directory?(file)
        mime_type = MIME::Types.type_for(file).first.simplified
        log.debug("Uploading #{file} with Content-Type: #{mime_type}, Cache-Control: #{header_max_age}")
        headers = { 'content-type' => mime_type, 'cache-control' => header_max_age }
        bucket.put(to_folder + '/' + file, File.read(file), {}, 'public-read', headers)
    end

    log.info('Done!')

    Dir.chdir(pwd)
end

task :default => :deploy
