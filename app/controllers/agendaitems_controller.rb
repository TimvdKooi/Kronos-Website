class AgendaitemsController < ApplicationController
  load_and_authorize_resource
  
  def index
    @agendaitems = Agendaitem.where("date >= ?", Time.now).paginate(:page => params[:page], :order => 'date ASC', :per_page => 10)
  end
  
  def wedstrijden
    @agendaitems = Agendaitem.joins(:agendaitemtype).where(:agendaitemtypes => {:is_match => true}).where("date >= ?", Time.now).paginate(:page => params[:page], :per_page => 10)
    render :action => "index"    
  end
  
  def archief
    @agendaitems = Agendaitem.paginate(:page => params[:page], :order => 'date DESC', :per_page => 10)
    
    render :action => "index"
  end

  def new
    @agendaitem = Agendaitem.new
    @agendaitem.date = Time.now
    @agendaitem.subscriptiondeadline = Time.now
    @commissions = current_user.admin? ? Commission.all : current_user.commissions
  end
  
  def show
    @agendaitem = Agendaitem.find(params[:id])
    @comments = @agendaitem.comments
    @comment = @agendaitem.comments.build
    
    if current_user
      @agendaitem.subscriptions.each do |subscr|
        if subscr.user == current_user
          @subscriptionbestaand = subscr
        end
      end
      if (defined?(@subscriptionbestaand)).nil?
        @subscription = Subscription.new
        @subscription.name = current_user.name.split[0]
        @subscription.agendaitem = @agendaitem
      end
    end
  end

  def create
    @agendaitem = Agendaitem.new(params[:agendaitem])
    
    respond_to do |format|
      if @agendaitem.save
        format.html { redirect_to @agendaitem, notice: 'Agendaitem was successfully created.' }
        format.json { render json: @agendaitem, status: :created, location: @agendaitem }
      else
        format.html { render action: "index" }
        format.json { render json: @agendaitem.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @agendaitem = Agendaitem.find(params[:id])
    @agendaitem.destroy

    respond_to do |format|
      format.html { redirect_to agendaitems_path }
      format.json { head :ok }
    end
  end

  def edit
    @agendaitem = Agendaitem.find(params[:id])
    @commissions = current_user.admin? ? Commission.all : current_user.commissions
  end

  def update
    @agendaitem = Agendaitem.find(params[:id])
    @agendaitem.attributes = params[:agendaitem]
    @agendaitem.comments.each do |comment|
        comment.user = current_user if comment.new_record?
    end
    

    respond_to do |format|
      if @agendaitem.save
        format.html { if params[:action] == "edit"
                        redirect_to edit_agendaitem_path(@agendaitem), notice: 'Agendaitem was successfully updated.'
                      else
                        redirect_to @agendaitem
                      end
        }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @agendaitem.errors, status: :unprocessable_entity }
      end
    end
  end
  

end
