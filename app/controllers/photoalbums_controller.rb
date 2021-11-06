class PhotoalbumsController < Admin::ApplicationController
  load_and_authorize_resource
  # GET /photoalbums
  # GET /photoalbums.json
  def index
    @photoalbums = Photoalbum.order('eventdate DESC NULLS LAST, created_at DESC ').paginate(:page => params[:page], :per_page => 12).includes(:agendaitem)

    if current_user.nil?
      @photoalbums = @photoalbums.where(public: true)
    end
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @photoalbums }
    end
  end

  # GET /photoalbums/1
  # GET /photoalbums/1.json
  def show
    @photoalbum = Photoalbum.find(params[:id])
  
    # temporary solution to get exif information in photos which are on the server: TODO
    @exifphotos = @photoalbum.photos.where(exif_date: nil, photo_content_type: "image/jpeg")
    @exifphotos.each do |p|
      if File.exists?(p.photo.path)
        exif = EXIFR::JPEG.new(p.photo.path)
        p.exif_date = exif.date_time
        if not exif.date_time.nil?
          p.save
        end
      end
    end

    @allphotos = @photoalbum.photos.all.order('exif_date ASC, photo_file_name ASC, created_at ASC')
    @photos = @photoalbum.photos.order('exif_date ASC, photo_file_name ASC, created_at ASC').paginate(:page => params[:page], :per_page => 12)
	
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: {photoalbum: @photoalbum.as_json, photos: @allphotos.map {|photo| photo.as_json(methods: [:photo_url_normal, :photo_url_thumb])}}}
    end
  end

  # GET /photoalbums/new
  # GET /photoalbums/new.json
  def new
    @photoalbum = Photoalbum.new
    @agendaitems = Agendaitem.order("date DESC").limit("50")
    
    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @photoalbum }
    end
  end

  # GET /photoalbums/1/edit
  def edit
    @photoalbum = Photoalbum.find(params[:id])
  end

  # POST /photoalbums
  # POST /photoalbums.json
  def create
    @photoalbum = Photoalbum.new(photoalbum_params)

    respond_to do |format|
      if @photoalbum.save
        format.html { redirect_to edit_photoalbum_path @photoalbum, notice: 'Photoalbum was successfully created.' }
        format.json { render json: @photoalbum, status: :created, location: @photoalbum }
      else
        format.html { render 'new' }
        format.json { render json: @photoalbum.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /photoalbums/1
  # PUT /photoalbums/1.json
  def update
    @photoalbum = Photoalbum.find(params[:id])

    respond_to do |format|
      if @photoalbum.update_attributes(photoalbum_params)
        format.html { redirect_to @photoalbum, notice: 'Photoalbum was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @photoalbum.errors, status: :unprocessable_entity }
      end
    end
  end

  # GET /photoalbums/1/publish
  def publish
    @photoalbum = Photoalbum.find(params[:id])

    @photoalbum.public = !@photoalbum.public

    @photoalbum.save

    redirect_to @photoalbum, notice: 'Photoalbum was successfully published.'
  end

  # DELETE /photoalbums/1
  # DELETE /photoalbums/1.json
  def destroy
    @photoalbum = Photoalbum.find(params[:id])
    @photoalbum.destroy

    respond_to do |format|
      format.html { redirect_to photoalbums_url }
      format.json { head :ok }
    end
  end

  private

  def photoalbum_params
    if current_user.admin?
      params.require(:photoalbum).permit(:name, :name_en, :agendaitem_id, :public, :eventdate, :url)
    else
      params.require(:photoalbum).permit(:name, :name_en, :agendaitem_id, :eventdate, :url)
    end

  end
end
