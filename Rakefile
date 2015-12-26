# encoding: utf-8

require 'aws'
require 'logger'
require 'mime-types'

log = Logger.new(STDOUT)
log.level = Logger::INFO

pwd = Dir.getwd

from_folder = 'src'
to_folder = 'assets'

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
        log.debug("Uploading #{file} with Content-Type: #{mime_type}")
        headers = {'content-type' => mime_type}
        bucket.put(to_folder + '/' + file, File.read(file), {}, 'public-read', headers)
    end

    log.info('Done!')

    Dir.chdir(pwd)
end

task :default => :deploy
