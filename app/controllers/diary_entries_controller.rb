class DiaryEntriesController < ApplicationController
  before_action :require_login
  before_action :set_movie

  def create
    @diary_entry = @movie.diary_entries.build(diary_entry_params)
    @diary_entry.user = current_user
    if @diary_entry.save
      redirect_to movie_path(@movie), notice: "Registrado no diário."
    else
      redirect_to movie_path(@movie), alert: @diary_entry.errors.full_messages.to_sentence
    end
  end

  def edit
    @diary_entry = current_user.diary_entries.find(params[:id])
  end

  def update
    @diary_entry = current_user.diary_entries.find(params[:id])
    if @diary_entry.update(diary_entry_params)
      redirect_to movie_path(@movie), notice: "Diário atualizado."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    current_user.diary_entries.find(params[:id]).destroy
    redirect_to movie_path(@movie), notice: "Registro removido."
  end

  private

  def set_movie
    @movie = Movie.find_by!(tmdb_id: params[:movie_id])
  end

  def diary_entry_params
    params.require(:diary_entry).permit(:rating, :watched_on)
  end
end